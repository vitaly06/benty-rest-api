import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  private readonly apiUrl = 'https://enter.tochka.com/uapi/acquiring/v1.0';
  // 'https://enter.tochka.com/sandbox/v2/acquiring/v1.0';
  // private readonly merchantId: string;
  private readonly customerCode: string;
  private readonly clientId: string;
  // private readonly frontendUrl: string;
  private readonly jwtToken: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.customerCode = this.configService.get('CUSTOMER_CODE');
    this.jwtToken = this.configService.get('JWT_TOKEN');
    this.clientId = this.configService.get('CLIENT_ID');
    // this.token = this.configService.get('TOCHKA_API_TOKEN');
    // this.merchantId = this.configService.get('TOCHKA_MERCHANT_ID');
  }

  async createLink(userId: number, subscriptionId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new BadRequestException('Данной подписки не существует');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Данного пользователя не существует');
    }

    const orderId = `sub_${subscriptionId}_user_${userId}_${Date.now()}`;
    const purpose = `Оплата подписки: ${subscription.name}`;
    const payload = {
      Data: {
        customerCode: this.customerCode,
        amount: subscription.price.toFixed(2),
        purpose,
        redirectUrl: 'https://benty.work',
        paymentMode: ['sbp', 'card', 'tinkoff'],
        saveCard: true,
        consumerId: orderId,
        // merchantId: '200000000001056',
        ttl: 10080,
      },
    };

    try {
      // console.log(`Bearer ${this.jwtToken.trim()}`);
      // sandbox.jwt.token

      const response = await this.httpService
        .post(`${this.apiUrl}/payments`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.jwtToken.trim()}`,
            'X-Client-ID': this.clientId,
            // Authorization: 'Bearer sandbox.jwt.token',
          },
        })
        .toPromise();
      const payment = await this.prisma.payment.create({
        data: {
          amount: +subscription.price,
          purpose: purpose,
          orderId: orderId,
          userId: userId,
          operationId: response.data.Data.operationId,
          paymentLink: response.data.Data.paymentLink,
          expiresAt: new Date(Date.now() + 10080 * 60 * 1000), // 10080 минут в мс
        },
      });

      return {
        paymentLink: response.data.Data.paymentLink,
        operationId: response.data.Data.operationId,
        paymentId: payment.id,
      };
    } catch (error) {
      console.log(error?.response?.data?.Errors);
      throw new HttpException(`Payment creation failed: ${error.message}`, 500);
    }
  }

  async getOperationInfo(operationId: string) {
    console.log(operationId);
    try {
      const response = await this.httpService
        .get(`${this.apiUrl}/payments/${operationId}`, {
          headers: {
            Authorization: 'Bearer sandbox.jwt.token',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .toPromise();
      const status = response.data['Data']['Operation'][0]['status'];

      if (status == 'APPROVED') {
        const payment = await this.prisma.payment.findFirst({
          where: { operationId },
          include: { user: true },
        });
        if (!payment) {
          throw new NotFoundException('Записи об оплате не найдено');
        }

        await this.prisma.payment.updateMany({
          where: { operationId },
          data: {
            status: 'APPROVED',
          },
        });

        const subscription = await this.prisma.subscription.findFirst({
          where: {
            price: +payment.amount,
          },
        });

        await this.prisma.user.update({
          where: { id: payment.user.id },
          data: {
            subscriptionId: subscription.id,
          },
        });

        return { message: 'Подписка пользователя обновлена' };
      }

      console.log(status);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException('Ошибка при получении информации о платеже', 500);
    }
  }

  async findPaymentByPurpose(purpose: string) {
    console.log(`Searching payment by purpose: ${purpose}`);
    const payment = await this.prisma.payment.findFirst({
      where: {
        purpose: {
          contains: purpose,
        },
        status: {
          not: 'executed',
        },
      },
    });
    console.log(`Payment found: ${JSON.stringify(payment)}`);
    return payment;
  }

  async updatePaymentStatus(
    paymentId: number,
    status: string,
    externalId?: string,
    amount?: number,
    currency?: string,
  ) {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (externalId) updateData.externalPaymentId = externalId;
    if (amount) updateData.amount = amount;
    if (currency) updateData.currency = currency;

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
    });
  }

  async findPaymentByOperationId(operationId: string) {
    console.log(`🔍 Searching payment by operationId: ${operationId}`);
    const payment = await this.prisma.payment.findUnique({
      where: { operationId },
    });
    console.log(`📋 Payment found: ${JSON.stringify(payment)}`);
    return payment;
  }

  async findPaymentByCustomerCode(customerCode: string) {
    console.log(`🔍 Searching payment by customerCode: ${customerCode}`);
    const payment = await this.prisma.payment.findFirst({
      where: {
        OR: [{ orderId: customerCode }, { operationId: customerCode }],
        status: {
          not: 'executed',
        },
      },
    });
    console.log(`📋 Payment found: ${JSON.stringify(payment)}`);
    return payment;
  }

  // Активация подписки пользователя
  async activateUserSubscription(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          Payment: {
            where: { status: 'executed' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!user) {
        console.log(`User ${userId} not found`);
        return;
      }

      if (!user.Payment || user.Payment.length === 0) {
        console.log(`No executed payments found for user ${userId}`);
        return;
      }

      const successfulPayment = user.Payment[0];

      // Находим подписку по цене
      const subscription = await this.prisma.subscription.findFirst({
        where: { price: successfulPayment.amount },
      });

      if (!subscription) {
        console.log(`Subscription not found`);
        return;
      }

      // Обновляем подписку пользователя
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionId: subscription.id,
        },
      });

      console.log(
        `Subscription activated for user ${userId}: ${subscription.name}`,
      );
    } catch (error) {
      console.log(`Error activating subscription for user ${userId}:`, error);
    }
  }
}
