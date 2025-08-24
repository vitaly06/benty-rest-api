import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { PaymentService } from 'src/payment/payment.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookVerificationService: WebhookService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('tochka')
  async handleTochkaWebhook(
    @Body() body: string, // Тело вебхука - JWT строка
    @Headers('x-webhook-signature') signature: string, // Опциональная подпись
  ) {
    try {
      this.logger.log('Received webhook from Tochka');

      // Верифицируем JWT токен
      const decodedData =
        await this.webhookVerificationService.verifyWebhookToken(body);

      this.logger.log(`Webhook type: ${decodedData.webhookType}`);
      this.logger.log(`Decoded data: ${JSON.stringify(decodedData)}`);

      // Обрабатываем разные типы вебхуков
      switch (decodedData.webhookType) {
        case 'incomingPayment':
          await this.handleIncomingPayment(decodedData);
          break;

        // case 'outgoingPayment':
        //   await this.handleOutgoingPayment(decodedData);
        //   break;

        case 'incomingSbpPayment':
          await this.handleIncomingSbpPayment(decodedData);
          break;

        // case 'incomingSbpB2BPayment':
        //   await this.handleIncomingSbpB2BPayment(decodedData);
        //   break;

        case 'acquiringInternetPayment':
          await this.handleAcquiringPayment(decodedData);
          break;

        default:
          this.logger.warn(`Unknown webhook type: ${decodedData.webhookType}`);
      }

      return { status: 'success', message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Обработка входящего платежа
  private async handleIncomingPayment(data: any) {
    this.logger.log(`Processing incoming payment: ${data.paymentId}`);

    const {
      paymentId,
      amount,
      purpose,
      customerCode,
      SidePayer, // Информация о плательщике
      SideRecipient, // Информация о получателе
      documentNumber,
      date,
    } = data;

    // Ищем платеж по purpose или другим данным
    const payment = await this.paymentService.findPaymentByPurpose(purpose);

    if (payment) {
      // Обновляем статус платежа
      await this.paymentService.updatePaymentStatus(
        payment.id,
        'executed',
        paymentId,
        amount,
      );

      // Активируем подписку пользователя
      await this.paymentService.activateUserSubscription(payment.userId);
    }

    this.logger.log(`Incoming payment processed: ${paymentId}`);
  }

  // Обработка исходящего платежа
  private async handleOutgoingPayment(data: any) {
    this.logger.log(`Processing outgoing payment: ${data.paymentId}`);
    // Логика обработки исходящих платежей
  }

  // Обработка SBP платежа
  private async handleIncomingSbpPayment(data: any) {
    this.logger.log(`Processing SBP payment: ${data.paymentId}`);
    // Логика обработки SBP платежей
  }

  // Обработка acquiring платежа
  private async handleAcquiringPayment(data: any) {
    this.logger.log(`Processing acquiring payment: ${data.paymentId}`);

    // Для интернет-эквайринга ищем по operationId или consumerId
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
        );

        await this.paymentService.activateUserSubscription(payment.userId);
      }
    }
  }
}
