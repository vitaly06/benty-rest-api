import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, PaymentService],
})
export class WebhookModule {}
