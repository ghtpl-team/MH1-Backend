import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';
import { WebhookCreateDto } from './dto/webhooks.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { IAPService } from 'src/utils/iap/iap.service';

@Controller('webhooks')
@ApiTags('Webhooks')
@ApiBearerAuth()
export class WebhooksController {
  constructor(
    private readonly razorPayWebhookService: WebhooksService,
    private readonly iapService: IAPService,
  ) {}

  @Post()
  async createWebhook(@Body() reqBody: WebhookCreateDto) {
    return this.razorPayWebhookService.create(reqBody);
  }

  @Post('subscription')
  async resolveWebhook(
    @Body() body: SubscriptionWebhookPayload,
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
    @Headers('x-razorpay-event-id') eventId: string,
  ) {
    const rawBody = req.rawBody.toString();
    console.log('Webhook Raw Body', rawBody);
    console.log('Signature', signature);

    return this.razorPayWebhookService.resolveRazorPayWebhook(
      rawBody,
      body,
      signature,
      eventId,
    );
  }

  @Post('iap/subscription')
  async resolveIAPWebhook(@Body() body: any) {
    return this.iapService.handleWebhook('ios', body);
  }
}
