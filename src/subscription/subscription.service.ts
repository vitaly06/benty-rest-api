import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.subscription.findMany({
      select: { id: true, name: true },
    });
  }

  private readonly logger = new Logger(SubscriptionService.name);

  // Активация подписки пользователя
  async activateUserSubscription(userId: number, subscriptionId: number) {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription) {
        throw new Error(`Subscription ${subscriptionId} not found`);
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + subscription.duration);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionId: subscription.id,
          subscriptionStartAt: startDate,
          subscriptionEndAt: endDate,
        },
      });

      this.logger.log(
        `Subscription activated for user ${userId}: ${subscription.name} until ${endDate}`,
      );
    } catch (error) {
      this.logger.error(
        `Error activating subscription for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  // Проверка и сброс истекших подписок
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Запуск каждый день в полночь
  async checkExpiredSubscriptions() {
    try {
      const now = new Date();

      const expiredUsers = await this.prisma.user.findMany({
        where: {
          subscriptionId: { not: 1 }, // Не базовая подписка
          subscriptionEndAt: { lt: now }, // Подписка истекла
        },
      });

      if (expiredUsers.length > 0) {
        this.logger.log(`Found ${expiredUsers.length} expired subscriptions`);

        const defaultSubscription = await this.prisma.subscription.findFirst({
          where: { isDefault: true },
        });

        if (!defaultSubscription) {
          throw new Error('Default subscription not found');
        }

        // Сбрасываем подписки на базовую
        await this.prisma.user.updateMany({
          where: {
            id: { in: expiredUsers.map((user) => user.id) },
          },
          data: {
            subscriptionId: defaultSubscription.id,
            subscriptionStartAt: null,
            subscriptionEndAt: null,
          },
        });

        this.logger.log(
          `Reset ${expiredUsers.length} subscriptions to default`,
        );
      }
    } catch (error) {
      this.logger.error('Error checking expired subscriptions:', error);
    }
  }

  // Получение информации о текущей подписке пользователя
  async getUserSubscriptionInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const isActive = user.subscriptionEndAt && user.subscriptionEndAt > now;
    const daysRemaining = user.subscriptionEndAt
      ? Math.ceil(
          (user.subscriptionEndAt.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    return {
      subscription: user.subscription,
      isActive,
      daysRemaining: isActive ? daysRemaining : 0,
      startDate: user.subscriptionStartAt,
      endDate: user.subscriptionEndAt,
    };
  }
}
