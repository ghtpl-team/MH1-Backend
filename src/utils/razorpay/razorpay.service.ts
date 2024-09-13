import { Injectable } from '@nestjs/common';
import RazorpayInstance from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { SubscriptionWebhookPayload } from 'src/webhooks/webhooks.interface';
import {
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from 'src/subscriptions/dto/subscriptions.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validateWebhookSignature } = require('razorpay');
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
}
