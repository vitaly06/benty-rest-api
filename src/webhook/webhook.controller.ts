import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  HttpStatus,
  HttpCode,
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
  @HttpCode(200)
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
      this.logger.debug(`Decoded data: ${JSON.stringify(decodedData)}`);

      // Асинхронно обрабатываем вебхук (после отправки ответа)
      setTimeout(async () => {
        try {
          // Обрабатываем разные типы вебхуков
          switch (decodedData.webhookType) {
            case 'incomingPayment':
              await this.handleIncomingPayment(decodedData);
              break;

            case 'incomingSbpPayment':
              await this.handleIncomingSbpPayment(decodedData);
              break;

            case 'acquiringInternetPayment':
              await this.handleAcquiringPayment(decodedData);
              break;

            default:
              this.logger.warn(
                `Unknown webhook type: ${decodedData.webhookType}`,
              );
          }
        } catch (error) {
          this.logger.error('Async webhook processing error:', error);
        }
      }, 0);

      // ВАЖНО: Всегда возвращаем 200 OK API Точке немедленно
      return {
        status: 'success',
        message: 'Webhook accepted for processing',
      };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);

      // ВАЖНО: Даже при ошибке возвращаем 200 OK!
      return {
        status: 'accepted',
        message: 'Webhook received (processing may have failed)',
      };
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
      SidePayer,
      SideRecipient,
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

  // Обработка SBP платежа
  private async handleIncomingSbpPayment(data: any) {
    this.logger.log(`Processing SBP payment: ${data.paymentId}`);
    // Логика обработки SBP платежей
    // Аналогично handleIncomingPayment
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
