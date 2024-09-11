import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly em: EntityManager,
    private readonly razorPayService: RazorpayService,
  ) {}

  async resolveRazorPayWebhook(
    subscription: string,
    rawBody: SubscriptionWebhookPayload,
    signature: string,
  ) {
    try {
      const isValid = this.razorPayService.verifyWebhookSignature(
        rawBody,
        signature,
      );

      if (!isValid) {
        throw new HttpException(
          'Webhook Signature Validation Failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
