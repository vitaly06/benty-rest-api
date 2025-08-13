import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat.service';
// import { UseGuards } from '@nestjs/common';
// import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
// @UseGuards(WsJwtGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('joinChats')
  async handleJoinChats(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const chats = await this.chatService.getChatHistory(userId);
    chats.forEach((chat) => {
      client.join(`chat_${chat.id}`);
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatId: number; senderId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.sendMessage(
        data.chatId,
        data.senderId,
        data.content,
      );

      // Обновляем время последнего обновления чата
      await this.chatService.markMessagesAsRead(data.chatId, data.senderId);

      this.server.to(`chat_${data.chatId}`).emit('newMessage', message);
    } catch (error) {
      console.log(error);
      client.emit('error', 'Failed to send message');
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { chatId: number; userId: number },
  ) {
    await this.chatService.markMessagesAsRead(data.chatId, data.userId);
  }
}
