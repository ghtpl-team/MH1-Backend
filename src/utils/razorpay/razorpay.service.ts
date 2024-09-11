import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { SubscriptionWebhookPayload } from 'src/webhooks/webhooks.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validateWebhookSignature } = require('razorpay');

@Injectable()
export class RazorpayService {
  private readonly razorpayInstance: Razorpay;

  constructor(private configService: ConfigService) {
    this.razorpayInstance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  getInstance(): Razorpay {
    return this.razorpayInstance;
  }

  verifyWebhookSignature(body: SubscriptionWebhookPayload, signature: string) {
    try {
      return validateWebhookSignature(
        JSON.stringify(body),
        signature,
        this.configService.get<string>('SECRET'),
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return false;
    }
  }
}
