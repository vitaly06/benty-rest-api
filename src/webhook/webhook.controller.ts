import {
  Controller,
  Post,
  Headers,
  Logger,
  HttpCode,
  Get,
  Head,
  Req,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';
import { PaymentService } from 'src/payment/payment.service';
import * as jwt from 'jsonwebtoken';

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
    this.logger.log('✅ Tochka availability check received');
    return 'OK';
  }

  @Post('tochka')
  @HttpCode(200)
  async handleTochkaWebhook(
    @Body() rawBody: string,
    @Headers('x-webhook-signature') signature: string,
    @Req() req: Request,
  ) {
    try {
      this.logger.log('=== 🎯 WEBHOOK RECEIVED ===');
      this.logger.log(`📋 Signature: ${signature}`);
      this.logger.log(`📏 Raw body length: ${rawBody.length}`);

      if (!rawBody) {
        this.logger.warn('⚠️ Empty body received');
        return { status: 'accepted', message: 'Empty webhook received' };
      }

      // Показываем начало тела для отладки
      this.logger.log(`📝 Body preview: ${rawBody.substring(0, 100)}...`);

      this.logger.log('🔐 Detected JWT token');

      // Сначала проверим структуру
      const inspected = this.webhookVerificationService.inspectToken(rawBody);
      if (!inspected) {
        this.logger.warn('❌ Invalid JWT structure');
        return { status: 'accepted', message: 'Invalid JWT format' };
      }

      // Верифицируем JWT
      this.logger.log('Attempting to verify JWT...');
      const decodedData =
        await this.webhookVerificationService.verifyWebhookToken(rawBody);

      this.logger.log(`✅ JWT verified successfully`);
      this.logger.log(`📦 Webhook type: ${decodedData.webhookType}`);
      this.logger.log(`💰 Amount: ${decodedData.amount}`);
      this.logger.log(`🏢 Customer code: ${decodedData.customerCode}`);
      this.logger.log(
        `📋 Full payload: ${JSON.stringify(decodedData, null, 2)}`,
      );

      // Обрабатываем вебхук
      await this.processWebhookImmediately(decodedData);

      this.logger.log('=== ✅ WEBHOOK PROCESSING COMPLETE ===');
      return {
        status: 'success',
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      this.logger.error('💥 Webhook processing error:', error.message);

      // Для отладки попробуем просто декодировать без верификации
      try {
        this.logger.log('🔄 Trying to decode without verification...');
        const decoded = jwt.decode(rawBody, { complete: true });
        if (decoded) {
          this.logger.log(
            `📋 Decoded without verification: ${JSON.stringify(decoded.payload)}`,
          );
        }
      } catch (decodeError) {
        this.logger.error('❌ Even decoding failed:', decodeError.message);
      }

      return {
        status: 'accepted',
        message: 'Webhook received (processing may have failed)',
      };
    }
  }

  private async processWebhookImmediately(decodedData: any) {
    try {
      this.logger.log(`🔄 Processing webhook type: ${decodedData.webhookType}`);
      this.logger.log(`📊 Full data: ${JSON.stringify(decodedData, null, 2)}`);

      // Для acquiringInternetPayment
      if (decodedData.webhookType === 'acquiringInternetPayment') {
        this.logger.log('💳 Processing acquiring payment');

        if (decodedData.operationId) {
          this.logger.log(`🔍 Operation ID: ${decodedData.operationId}`);
          const payment = await this.paymentService.findPaymentByOperationId(
            decodedData.operationId,
          );

          if (payment) {
            await this.paymentService.updatePaymentStatus(
              payment.id,
              'executed',
              decodedData.paymentId,
              decodedData.amount,
              decodedData.currency || 'RUB',
            );
            await this.paymentService.activateUserSubscription(payment.userId);
          }
        }
      }
      // Добавьте другие типы вебхуков...
    } catch (error) {
      this.logger.error('💥 Error in processWebhookImmediately:', error);
      throw error;
    }
  }

  private async handleIncomingPayment(data: any) {
    this.logger.log('=== 💰 HANDLE INCOMING PAYMENT START ===');
    this.logger.log(`📦 Payment data: ${JSON.stringify(data)}`);

    let payment;
    if (data.customerCode) {
      this.logger.log(`🔍 Searching by customerCode: ${data.customerCode}`);
      payment = await this.paymentService.findPaymentByCustomerCode(
        data.customerCode,
      );
      this.logger.log(`📋 Found by customerCode: ${JSON.stringify(payment)}`);
    }

    if (!payment && data.purpose) {
      this.logger.log(`🔍 Searching by purpose: ${data.purpose}`);
      payment = await this.paymentService.findPaymentByPurpose(data.purpose);
      this.logger.log(`📋 Found by purpose: ${JSON.stringify(payment)}`);
    }

    if (payment) {
      this.logger.log(
        `✅ PAYMENT FOUND: ID ${payment.id}, User ID: ${payment.userId}`,
      );

      this.logger.log('🔄 Updating payment status...');
      await this.paymentService.updatePaymentStatus(
        payment.id,
        'executed',
        data.paymentId,
        data.amount,
        data.currency || 'RUB',
      );

      this.logger.log(
        `🎯 Activating user subscription for user: ${payment.userId}`,
      );
      await this.paymentService.activateUserSubscription(payment.userId);

      this.logger.log('✅ Payment processed successfully');
    } else {
      this.logger.warn(
        `❌ PAYMENT NOT FOUND FOR DATA: ${JSON.stringify(data)}`,
      );
    }

    this.logger.log('=== 💰 HANDLE INCOMING PAYMENT END ===');
  }

  private async handleIncomingSbpPayment(data: any) {
    this.logger.log(`🔗 Processing SBP payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data);
  }

  private async handleIncomingSbpB2BPayment(data: any) {
    this.logger.log(`🏢 Processing SBP B2B payment: ${data.paymentId}`);
    await this.handleIncomingPayment(data);
  }

  private async handleAcquiringPayment(data: any) {
    this.logger.log(`💳 Processing acquiring payment: ${data.paymentId}`);

    if (data.operationId) {
      this.logger.log(`🔍 Searching by operationId: ${data.operationId}`);
      const payment = await this.paymentService.findPaymentByOperationId(
        data.operationId,
      );

      if (payment) {
        this.logger.log('🔄 Updating payment status...');
        await this.paymentService.updatePaymentStatus(
          payment.id,
          'executed',
          data.paymentId,
          data.amount,
          data.currency || 'RUB',
        );

        this.logger.log(
          `🎯 Activating user subscription for user: ${payment.userId}`,
        );
        await this.paymentService.activateUserSubscription(payment.userId);
      } else {
        this.logger.warn(
          `❌ Payment not found for operationId: ${data.operationId}`,
        );
      }
    } else {
      this.logger.warn('⚠️ No operationId provided in acquiring payment');
    }
  }

  private async handleOutgoingPayment(data: any) {
    this.logger.log(`📤 Processing outgoing payment: ${data.paymentId}`);
    // Логика для исходящих платежей
  }
}
