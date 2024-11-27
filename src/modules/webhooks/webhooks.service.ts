import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';
import { WebhookCreateDto } from './dto/webhooks.dto';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Subscriptions,
  SubscriptionStatus,
} from 'src/entities/subscriptions.entity';
import { BillingLedger } from 'src/entities/billing-ledger.entity';
import { WebhookEvents } from 'src/entities/webhook-events.entity';

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

  async isWebhookProcessed(
    webhookPayload: SubscriptionWebhookPayload,
    eventId: string,
  ) {
    try {
      // Check if webhook event has been processed before
      const webhookEvent = await this.em.findOne(WebhookEvents, {
        eventId,
      });

      if (webhookEvent) {
        // Event already processed - return success without processing
        return true;
      }

      // Create webhook event record
      const newWebhookEvent = this.em.create(WebhookEvents, {
        eventId,
        event: webhookPayload.event,
        payload: webhookPayload,
      });

      await this.em.persistAndFlush(newWebhookEvent);
      return false;
    } catch (error) {
      throw error;
    }
  }

  async resolveRazorPayWebhook(
    rawBody: any,
    webhookPayload: SubscriptionWebhookPayload,
    signature: string,
    eventId: string,
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

      const isProcessed = await this.isWebhookProcessed(
        webhookPayload,
        eventId,
      );

      if (isProcessed) {
        return {
          status: 'success',
          message: 'Webhook event already processed',
        };
      }
      if (webhookPayload.payload?.subscription) {
        const subscriptionDetails = await this.em.findOne(
          Subscriptions,
          {
            razorPaySubscriptionId:
              webhookPayload.payload?.subscription?.entity?.id,
          },
          {
            populate: [
              'id',
              'razorPaySubscriptionId',
              'user',
              'subscriptionStatus',
              'totalBillingCycle',
            ],
          },
        );

        const updatedSubscription = await this.em.assign(subscriptionDetails, {
          subscriptionStatus:
            subscriptionDetails.subscriptionStatus ===
            SubscriptionStatus.CANCELLED
              ? SubscriptionStatus.CANCELLED
              : webhookPayload?.payload?.subscription?.entity?.status,
          remainingCount:
            webhookPayload?.payload?.subscription?.entity?.remaining_count,
          expiryDate:
            webhookPayload?.payload?.subscription?.entity?.current_end ??
            undefined,
        });

        await this.em.persistAndFlush(updatedSubscription);

        if (updatedSubscription) {
          const totalPaid =
            updatedSubscription.totalBillingCycle -
            (updatedSubscription.remainingCount ??
              updatedSubscription.totalBillingCycle);
          await this.subscriptionService.resetUsage(
            updatedSubscription.user.id,
            updatedSubscription,
            webhookPayload.payload?.payment ? true : false,
            totalPaid,
          );

          await this.cacheService.set(
            updatedSubscription.user.id.toString(),
            updatedSubscription.subscriptionStatus,
            3000000,
          );

          if (webhookPayload.payload?.payment) {
            const { amount, currency, id } =
              webhookPayload?.payload?.payment?.entity;
            const paymentData = await this.em.create(BillingLedger, {
              amount: amount,
              currency: currency,
              razorpayPaymentId: id,
              paymentResponse: webhookPayload.payload.payment.entity,
              user: updatedSubscription.user.id,
              subscription: updatedSubscription.id,
            });

            await this.em.persistAndFlush(paymentData);
          }
        }
      }

      return {
        status: 'success',
        message: 'Webhook event processed',
      };
    } catch (error) {
      throw error;
    }
  }
}
