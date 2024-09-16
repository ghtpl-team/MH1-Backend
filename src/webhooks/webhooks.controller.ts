import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';
import { WebhookCreateDto } from './dto/webhooks.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly razorPayWebhookService: WebhooksService) {}

  @Post()
  async createWebhook(@Body() reqBody: WebhookCreateDto) {
    return this.razorPayWebhookService.create(reqBody);
  }

  @Post('subscription')
  async resolveWebhook(
    @Body() rawBody: SubscriptionWebhookPayload,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.razorPayWebhookService.resolveRazorPayWebhook(
      rawBody,
      signature,
    );
  }
}
