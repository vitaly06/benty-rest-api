// src/chat/chat.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveMessage(
    senderId: number,
    receiverId: number,
    content?: string,
    filePath?: string,
  ) {
    console.log('Attempting to save message:', {
      senderId,
      receiverId,
      content,
      filePath,
    });

    if (senderId === receiverId) {
      console.log('Error: Sender and receiver are the same');
      throw new BadRequestException('Нельзя отправить сообщение самому себе');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    console.log('Receiver:', receiver);

    if (!receiver) {
      console.log('Error: Receiver not found');
      throw new NotFoundException('Получатель не найден');
    }

    try {
      const message = await this.prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
          filePath,
          isRead: false,
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          content: true,
          filePath: true,
          createdAt: true,
          isRead: true,
        },
      });
      console.log('Message saved successfully:', message);
      return message;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new BadRequestException(
        `Ошибка сохранения сообщения: ${error.message}`,
      );
    }
  }

  async setUserStatus(userId: number, status: 'online' | 'offline') {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { status },
      });
      console.log(`User ${userId} status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating status for user ${userId}:`, error);
      throw new BadRequestException('Не удалось обновить статус пользователя');
    }
  }

  async getConversation(userId: number, otherUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!user || !otherUser) {
      throw new NotFoundException('Один из пользователей не найден');
    }

    return await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        createdAt: true,
      },
    });
  }

  async getUserChats(userId: number) {
    // Получаем все сообщения, где пользователь является отправителем или получателем
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            fullName: true,
            logoFileName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            logoFileName: true,
          },
        },
      },
    });

    // Группируем сообщения по собеседнику
    const chatsMap = new Map<number, any>();
    messages.forEach((message) => {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser =
        message.senderId === userId ? message.receiver : message.sender;

      if (!chatsMap.has(otherUserId)) {
        chatsMap.set(otherUserId, {
          id: otherUserId,
          fullName: otherUser.fullName || `Пользователь ${otherUserId}`,
          logoFileName: otherUser.logoFileName,
          lastMessage: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
          },
        });
      } else {
        const existingChat = chatsMap.get(otherUserId);
        if (
          new Date(message.createdAt) >
          new Date(existingChat.lastMessage.createdAt)
        ) {
          existingChat.lastMessage = {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
          };
        }
      }
    });
    return Array.from(chatsMap.values()) || null;
  }

  async registerUserSocket(userId: number, socketId: string) {
    await this.cacheManager.set(`socket:${userId}`, socketId, 0);
  }

  async removeUserSocket(userId: number) {
    await this.cacheManager.del(`socket:${userId}`);
  }

  async getUserSocket(userId: number): Promise<string | undefined> {
    return await this.cacheManager.get<string>(`socket:${userId}`);
  }
}
