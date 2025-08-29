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
      this.logger.log('=== WEBHOOK RECEIVED ===');
      this.logger.log(`Signature: ${signature}`);
      this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);

      // Получаем raw body как строку
      const rawBody = req.rawBody?.toString() || '';
      this.logger.log(`Raw body length: ${rawBody.length}`);

      if (rawBody.length > 0) {
        this.logger.log(
          `Raw body first 200 chars: ${rawBody.substring(0, 200)}`,
        );
      }

      if (!rawBody) {
        this.logger.warn('Empty webhook body received');
        return { status: 'accepted', message: 'Empty webhook received' };
      }

      // Верифицируем JWT токен
      this.logger.log('Attempting to verify JWT token...');
      const decodedData =
        await this.webhookVerificationService.verifyWebhookToken(rawBody);

      this.logger.log(`Webhook type: ${decodedData.webhookType}`);
      this.logger.log(
        `Decoded data keys: ${Object.keys(decodedData).join(', ')}`,
      );

      // Логируем важные поля для отладки
      if (decodedData.customerCode) {
        this.logger.log(`Customer code: ${decodedData.customerCode}`);
      }
      if (decodedData.purpose) {
        this.logger.log(`Purpose: ${decodedData.purpose}`);
      }
      if (decodedData.paymentId) {
        this.logger.log(`Payment ID: ${decodedData.paymentId}`);
      }
      if (decodedData.operationId) {
        this.logger.log(`Operation ID: ${decodedData.operationId}`);
      }
      if (decodedData.amount) {
        this.logger.log(`Amount: ${decodedData.amount}`);
      }

      // НЕМЕДЛЕННАЯ обработка (не асинхронная)
      this.logger.log('Processing webhook immediately...');
      await this.processWebhookImmediately(decodedData);

      this.logger.log('=== WEBHOOK PROCESSING COMPLETE ===');
      return {
        status: 'success',
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      this.logger.error('Error stack:', error.stack);
      return {
        status: 'accepted',
        message: 'Webhook received (processing may have failed)',
      };
    }
  }

  private async processWebhookImmediately(decodedData: any) {
    try {
      this.logger.log(`Processing webhook type: ${decodedData.webhookType}`);

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
      this.logger.error('Error in processWebhookImmediately:', error);
      throw error;
    }
  }

  private async handleIncomingPayment(data: any) {
    this.logger.log('=== HANDLE INCOMING PAYMENT START ===');
    this.logger.log(`Payment data: ${JSON.stringify(data)}`);

    let payment;
    if (data.customerCode) {
      this.logger.log(`Searching by customerCode: ${data.customerCode}`);
      payment = await this.paymentService.findPaymentByCustomerCode(
        data.customerCode,
      );
      this.logger.log(`Found by customerCode: ${JSON.stringify(payment)}`);
    }

    if (!payment && data.purpose) {
      this.logger.log(`Searching by purpose: ${data.purpose}`);
      payment = await this.paymentService.findPaymentByPurpose(data.purpose);
      this.logger.log(`Found by purpose: ${JSON.stringify(payment)}`);
    }

    if (payment) {
      this.logger.log(
        `PAYMENT FOUND: ID ${payment.id}, User ID: ${payment.userId}`,
      );

      this.logger.log('Updating payment status...');
      await this.paymentService.updatePaymentStatus(
        payment.id,
        'executed',
        data.paymentId,
        data.amount,
        data.currency || 'RUB',
      );

      this.logger.log(
        `Activating user subscription for user: ${payment.userId}`,
      );
      await this.paymentService.activateUserSubscription(payment.userId);

      this.logger.log('Payment processed successfully');
    } else {
      this.logger.warn(`PAYMENT NOT FOUND FOR DATA: ${JSON.stringify(data)}`);
    }

    this.logger.log('=== HANDLE INCOMING PAYMENT END ===');
  }

  private async handleIncomingSbpPayment(data: any) {
    this.logger.log(`Processing SBP payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data);
  }

  private async handleIncomingSbpB2BPayment(data: any) {
    this.logger.log(`Processing SBP B2B payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data);
  }

  private async handleAcquiringPayment(data: any) {
    this.logger.log(`Processing acquiring payment: ${data.paymentId}`);

    if (data.operationId) {
      this.logger.log(`Searching by operationId: ${data.operationId}`);
      const payment = await this.paymentService.findPaymentByOperationId(
        data.operationId,
      );
      this.logger.log(`Found by operationId: ${JSON.stringify(payment)}`);

      if (payment) {
        this.logger.log('Updating payment status...');
        await this.paymentService.updatePaymentStatus(
          payment.id,
          'executed',
          data.paymentId,
          data.amount,
          data.currency || 'RUB',
        );

        this.logger.log(
          `Activating user subscription for user: ${payment.userId}`,
        );
        await this.paymentService.activateUserSubscription(payment.userId);
      } else {
        this.logger.warn(
          `Payment not found for operationId: ${data.operationId}`,
        );
      }
    } else {
      this.logger.warn('No operationId provided in acquiring payment');
    }
  }

  private async handleOutgoingPayment(data: any) {
    this.logger.log(`Processing outgoing payment: ${data.paymentId}`);
    // Логика для исходящих платежей
  }
}
