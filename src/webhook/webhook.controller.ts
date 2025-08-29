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

      // Декодируем JWT
      this.logger.log('🔐 Decoding JWT token...');
      const decodedData =
        this.webhookVerificationService.decodeWebhookToken(rawBody);

      this.logger.log(`✅ JWT decoded successfully`);
      this.logger.log(`📦 Webhook type: ${decodedData.webhookType}`);
      this.logger.log(`💰 Amount: ${decodedData.amount}`);
      this.logger.log(`🏢 Customer code: ${decodedData.customerCode}`);
      this.logger.log(`🔧 Operation ID: ${decodedData.operationId}`);
      this.logger.log(`📋 Status: ${decodedData.status}`);
      this.logger.log(`🎯 Consumer ID: ${decodedData.consumerId}`);

      // Обрабатываем вебхук
      this.logger.log('⚡ Processing webhook...');
      await this.processWebhookImmediately(decodedData);

      this.logger.log('=== ✅ WEBHOOK PROCESSING COMPLETE ===');
      return {
        status: 'success',
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      this.logger.error('💥 Webhook processing error:', error.message);

      return {
        status: 'accepted',
        message: 'Webhook received (processing may have failed)',
      };
    }
  }

  private async processWebhookImmediately(decodedData: any) {
    try {
      this.logger.log(`🔄 Processing webhook type: ${decodedData.webhookType}`);

      // Для acquiring платежей
      if (decodedData.webhookType === 'acquiringInternetPayment') {
        this.logger.log('💳 Processing acquiring payment');

        // Ищем платеж по operationId или consumerId
        let payment;

        if (decodedData.operationId) {
          this.logger.log(
            `🔍 Searching by operationId: ${decodedData.operationId}`,
          );
          payment = await this.paymentService.findPaymentByOperationId(
            decodedData.operationId,
          );
        }

        if (!payment && decodedData.consumerId) {
          this.logger.log(
            `🔍 Searching by consumerId: ${decodedData.consumerId}`,
          );
          payment = await this.paymentService.findPaymentByCustomerCode(
            decodedData.consumerId,
          );
        }

        if (payment) {
          this.logger.log(
            `✅ Payment found: ID ${payment.id}, User ID: ${payment.userId}`,
          );

          // Обновляем статус платежа
          await this.paymentService.updatePaymentStatus(
            payment.id,
            'executed',
            decodedData.operationId || decodedData.paymentId,
            parseFloat(decodedData.amount),
            decodedData.currency || 'RUB',
          );

          // Активируем подписку пользователя
          await this.paymentService.activateUserSubscription(payment.userId);

          this.logger.log(
            `🎯 Subscription activated for user: ${payment.userId}`,
          );
        } else {
          this.logger.warn(
            `❌ Payment not found for operationId: ${decodedData.operationId}, consumerId: ${decodedData.consumerId}`,
          );
        }
      }
      // Добавьте обработку других типов вебхуков при необходимости
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
