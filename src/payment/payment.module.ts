import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, SubscriptionModule, AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
