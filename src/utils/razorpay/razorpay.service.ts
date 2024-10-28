import { Injectable } from '@nestjs/common';
import RazorpayInstance from 'razorpay';
import { ConfigService } from '@nestjs/config';
// import { SubscriptionWebhookPayload } from 'src/modules/webhooks/webhooks.interface';
import {
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from 'src/modules/subscriptions/dto/subscriptions.dto';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { validateWebhookSignature } = require('razorpay');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
@Injectable()
export class RazorpayService {
  private readonly razorpayInstance: RazorpayInstance;

  constructor(private configService: ConfigService) {
    this.razorpayInstance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  getInstance() {
    return this.razorpayInstance;
  }

  async createPlan(createPlanDto: SubscriptionPlanDto) {
    try {
      return await this.razorpayInstance.plans.create({
        period: createPlanDto.period,
        interval: createPlanDto.interval,
        item: {
          amount: createPlanDto.amountX100,
          currency: createPlanDto.currency,
          name: createPlanDto.name,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      return this.razorpayInstance.subscriptions.create({
        plan_id: createSubscriptionDto.planId,
        total_count: createSubscriptionDto.totalBillingCycle,
      });
    } catch (error) {
      throw error;
    }
  }

  verifyWebhookSignature(body: any, signature: string) {
    try {
      return (
        crypto
          .createHmac('sha256', this.configService.get<string>('SECRET'))
          .update(body)
          .digest('hex') === signature
      );
      // return validateWebhookSignature(JSON.stringify(body), signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return false;
    }
  }

  async createWebhook(
    events: Record<string, 0 | 1>,
    alertEmail: string = this.configService.get<string>('ALERT_EMAIL'),
  ) {
    return await this.razorpayInstance.webhooks.create({
      url: this.configService.get<string>('RAZORPAY_WEBHOOK_URL'),
      events,
      alert_email: alertEmail,
      secret: this.configService.get<string>('SECRET'),
    });
  }

  async cancelSubscription(id: string) {
    try {
      const response = await this.razorpayInstance.subscriptions.cancel(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
