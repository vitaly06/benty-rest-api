import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PaymentModule, HttpModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
