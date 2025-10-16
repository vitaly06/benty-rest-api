import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        logoFileName: true,
        email: true,
        fullName: true,
        isBanned: true,
        subscription: true,
        projects: true,
        Blog: true,
        followers: true,
        city: true,
        specializations: true,
        createdAt: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      logoFileName: user.logoFileName,
      fullName: user.fullName,
      email: user.email,
      activity: !user.isBanned ? 'АКТИВЕН' : 'ЗАБЛОКИРОВАН',
      subscriptionId: user.subscription.id,
      subsription: user.subscription.name,
      projectCount: user.projects.length,
      blogsCount: user.Blog.length,
      followers: user.followers.length,
      city: user.city || 'Не указан',
      specialization: user.specializations[0]?.name || 'Не указана',
      registerDate: this.formatDate(user.createdAt),
    }));
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  async deleteUser(id: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) {
      throw new BadRequestException('Пользователь не найден');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удалён' };
  }

  async updateSubscription(userId: number, subscriptionId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new BadRequestException('Подписка не найдена');
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + subscription.duration);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          connect: { id: subscriptionId },
        },
        subscriptionStartAt: now,
        subscriptionEndAt: endDate,
      },
    });

    return {
      message: 'Подписка успешно обновлена',
      subscriptionEndAt: this.formatDate(endDate),
    };
  }

  async banUser(id: number, reason: string) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) {
      throw new BadRequestException('Пользователь не найден');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isBanned: true,
        banReason: reason,
      },
    });

    return { message: 'Пользователь успешно заблокирован' };
  }

  async unbanUser(id: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) {
      throw new BadRequestException('Пользователь не найден');
    }
    await this.prisma.user.update({
      where: { id },
      data: {
        isBanned: false,
      },
    });
    return { message: 'Пользователь успешно разблокирован' };
  }
}
