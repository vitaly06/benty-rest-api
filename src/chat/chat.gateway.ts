import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { parse } from 'cookie';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      console.log('Cookies received:', cookieHeader);
      if (!cookieHeader) {
        client.emit('error', { message: 'Cookies отсутствуют' });
        throw new Error('Cookies отсутствуют');
      }

      const cookies = parse(cookieHeader);
      const token = cookies['access_token'];
      console.log('Token:', token);
      if (!token) {
        client.emit('error', { message: 'JWT-токен не найден в cookies' });
        throw new Error('JWT-токен не найден в cookies');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      console.log('Verified user:', payload);

      const userId = payload.sub;
      await this.chatService.registerUserSocket(userId, client.id);
      await this.chatService.setUserStatus(userId, 'online'); // Устанавливаем статус online
      client.join(`user_${userId}`);

      // Уведомляем всех о новом статусе
      this.server.emit('userStatus', { userId, status: 'online' });
    } catch (error) {
      console.error('Ошибка при подключении:', error.message);
      client.emit('error', {
        message: 'Ошибка подключения',
        error: error.message,
      });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      if (cookieHeader) {
        const cookies = parse(cookieHeader);
        const token = cookies['access_token'];
        if (token) {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_ACCESS_SECRET,
          });
          await this.chatService.removeUserSocket(payload.sub);
          await this.chatService.setUserStatus(payload.sub, 'offline'); // Устанавливаем статус offline
          this.server.emit('userStatus', {
            userId: payload.sub,
            status: 'offline',
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при отключении:', error.message);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: SendMessageDto) {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      if (!cookieHeader) {
        client.emit('error', { message: 'Cookies отсутствуют' });
        throw new Error('Cookies отсутствуют');
      }

      const cookies = parse(cookieHeader);
      const token = cookies['access_token'];
      if (!token) {
        client.emit('error', { message: 'JWT-токен не найден в cookies' });
        throw new Error('JWT-токен не найден в cookies');
      }

      const sender = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const message = await this.chatService.saveMessage(
        sender.sub,
        payload.receiverId,
        payload.content,
        payload.filePath, // Передаём путь к файлу, если есть
      );
      console.log('Message saved:', message);

      const receiverSocket = await this.chatService.getUserSocket(
        payload.receiverId,
      );
      if (receiverSocket) {
        this.server.to(`user_${payload.receiverId}`).emit('receiveMessage', {
          id: message.id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          filePath: message.filePath,
          createdAt: message.createdAt,
          isRead: message.isRead,
        });
      }

      this.server.to(`user_${sender.sub}`).emit('receiveMessage', {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        filePath: message.filePath,
        createdAt: message.createdAt,
      });

      return { status: 'Сообщение отправлено', message };
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error.message);
      client.emit('error', {
        message: 'Не удалось отправить сообщение',
        error: error.message,
      });
      throw error;
    }
  }
}
