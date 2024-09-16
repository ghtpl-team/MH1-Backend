import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { ConfigService } from '@nestjs/config';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Module({
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    ConfigService,
    RazorpayService,
    SubscriptionsService,
  ],
})
export class WebhooksModule {}
