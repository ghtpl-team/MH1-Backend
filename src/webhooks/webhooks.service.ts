import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';
import { WebhookCreateDto } from './dto/webhooks.dto';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Subscriptions } from 'src/entities/subscriptions.entity';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly em: EntityManager,
    private readonly razorPayService: RazorpayService,
    private readonly subscriptionService: SubscriptionsService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async create(webhookCreateDto: WebhookCreateDto) {
    try {
      const { events } = webhookCreateDto;
      return this.razorPayService.createWebhook(events);
    } catch (error) {
      throw error;
    }
  }

  async resolveRazorPayWebhook(
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

      if (rawBody.payload?.subscription) {
        const updateCount = await this.em.nativeUpdate(
          Subscriptions,
          {
            razorPaySubscriptionId: rawBody.payload?.subscription?.entity?.id,
          },
          {
            subscriptionStatus: rawBody?.payload?.subscription?.entity?.status,
          },
        );

        if (updateCount) {
          const subscriptionDetails = await this.em.findOne(
            Subscriptions,
            {
              razorPaySubscriptionId: rawBody.payload?.subscription?.entity?.id,
            },
            {
              populate: ['user', 'subscriptionStatus'],
            },
          );

          await this.cacheService.set(
            subscriptionDetails.user.id.toString(),
            subscriptionDetails.subscriptionStatus,
            3000000,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
