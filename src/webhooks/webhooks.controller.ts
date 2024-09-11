import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly razorPayWebhookService: WebhooksService) {}

  @Post(':subscriptionId')
  async resolveWebhook(
    @Param('subscriptionId') subscriptionId: string,
    @Body('rawBody') rawBody: SubscriptionWebhookPayload,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.razorPayWebhookService.resolveRazorPayWebhook(
      subscriptionId,
      rawBody,
      signature,
    );
  }
}
