import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, ConfigService, RazorpayService],
  exports: [SubscriptionsService],
})
export class SubscriptionModule {}
