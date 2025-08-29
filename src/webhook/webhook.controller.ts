import {
  Controller,
  Post,
  Headers,
  Logger,
  HttpCode,
  Get,
  Head,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';
import { PaymentService } from 'src/payment/payment.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookVerificationService: WebhookService,
    private readonly paymentService: PaymentService,
  ) {}

  // Для проверки доступности URL Точкой
  @Head('tochka')
  @Get('tochka')
  @HttpCode(200)
  async checkTochkaWebhookAvailability() {
    this.logger.log('Tochka availability check received');
    return 'OK';
  }

  @Post('tochka')
  @HttpCode(200)
  async handleTochkaWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-webhook-signature') signature: string,
  ) {
    try {
      this.logger.log('Received webhook from Tochka');

      // Получаем raw body как строку
      const rawBody = req.rawBody?.toString() || '';
      this.logger.debug(`Raw body: ${rawBody}`);

      if (!rawBody) {
        this.logger.warn('Empty webhook body received');
        return { status: 'accepted', message: 'Empty webhook received' };
      }

      // Верифицируем JWT токен
      const decodedData =
        await this.webhookVerificationService.verifyWebhookToken(rawBody);

      this.logger.log(`Webhook type: ${decodedData.webhookType}`);
      this.logger.debug(`Decoded data: ${JSON.stringify(decodedData)}`);

      // Асинхронно обрабатываем вебхук
      this.processWebhookAsync(decodedData).catch((error) => {
        this.logger.error('Async webhook processing error:', error);
      });

      return {
        status: 'success',
        message: 'Webhook accepted for processing',
      };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      return {
        status: 'accepted',
        message: 'Webhook received (processing may have failed)',
      };
    }
  }

  private async processWebhookAsync(decodedData: any) {
    try {
      switch (decodedData.webhookType) {
        case 'incomingPayment':
          await this.handleIncomingPayment(decodedData);
          break;

        case 'incomingSbpPayment':
          await this.handleIncomingSbpPayment(decodedData);
          break;

        case 'incomingSbpB2BPayment':
          await this.handleIncomingSbpB2BPayment(decodedData);
          break;

        case 'acquiringInternetPayment':
          await this.handleAcquiringPayment(decodedData);
          break;

        case 'outgoingPayment':
          await this.handleOutgoingPayment(decodedData);
          break;

        default:
          this.logger.warn(`Unknown webhook type: ${decodedData.webhookType}`);
      }
    } catch (error) {
      this.logger.error('Webhook processing failed:', error);
    }
  }

  private async handleIncomingPayment(data: any) {
    this.logger.log(`Processing incoming payment: ${data.paymentId}`);
    console.log(3);
    // Ищем платеж по purpose или customerCode
    let payment;
    if (data.customerCode) {
      payment = await this.paymentService.findPaymentByCustomerCode(
        data.customerCode,
      );
    }

    if (!payment && data.purpose) {
      payment = await this.paymentService.findPaymentByPurpose(data.purpose);
    }

    if (payment) {
      await this.paymentService.updatePaymentStatus(
        payment.id,
        'executed',
        data.paymentId,
        data.amount,
        data.currency || 'RUB',
      );

      await this.paymentService.activateUserSubscription(payment.userId);
      this.logger.log(`Payment ${data.paymentId} processed successfully`);
    } else {
      this.logger.warn(`Payment not found for: ${JSON.stringify(data)}`);
    }
  }

  private async handleIncomingSbpPayment(data: any) {
    console.log(2);
    this.logger.log(`Processing SBP payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data); // Обрабатываем так же
  }

  private async handleIncomingSbpB2BPayment(data: any) {
    this.logger.log(`Processing SBP B2B payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data); // Обрабатываем так же
  }

  private async handleAcquiringPayment(data: any) {
    console.log(1);
    this.logger.log(`Processing acquiring payment: ${data.paymentId}`);

    if (data.operationId) {
      const payment = await this.paymentService.findPaymentByOperationId(
        data.operationId,
      );

      if (payment) {
        await this.paymentService.updatePaymentStatus(
          payment.id,
          'executed',
          data.paymentId,
          data.amount,
          data.currency || 'RUB',
        );

        await this.paymentService.activateUserSubscription(payment.userId);
      }
    }
  }

  private async handleOutgoingPayment(data: any) {
    this.logger.log(`Processing outgoing payment: ${data.paymentId}`);
    // Логика для исходящих платежей
  }
}
