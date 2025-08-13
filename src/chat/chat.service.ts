import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateChat(user1Id: number, user2Id: number) {
    // Сортируем ID для обеспечения уникальности
    const [id1, id2] = [user1Id, user2Id].sort((a, b) => a - b);

    return this.prisma.chat.upsert({
      where: {
        user1Id_user2Id: {
          user1Id: id1,
          user2Id: id2,
        },
      },
      create: {
        user1Id: id1,
        user2Id: id2,
      },
      update: {},
      include: {
        Message: {
          orderBy: { createdAt: 'asc' },
          include: { sender: true },
        },
        user1: true,
        user2: true,
      },
    });
  }

  async sendMessage(chatId: number, senderId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        chatId,
      },
      include: {
        sender: true,
        chat: true,
      },
    });
  }

  async getChatHistory(userId: number) {
    return this.prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        Message: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user1: true,
        user2: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async markMessagesAsRead(chatId: number, userId: number) {
    return this.prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });
  }
}
