import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { SubscriptionWebhookPayload } from './webhooks.interface';
import { WebhookCreateDto } from './dto/webhooks.dto';
import { SubscriptionsService } from 'src/modules/subscriptions/subscriptions.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Subscriptions } from 'src/entities/subscriptions.entity';
import { BillingLedger } from 'src/entities/billing-ledger.entity';

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
    rawBody: any,
    webhookPayload: SubscriptionWebhookPayload,
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

      if (webhookPayload.payload?.subscription) {
        const updateCount = await this.em.nativeUpdate(
          Subscriptions,
          {
            razorPaySubscriptionId:
              webhookPayload.payload?.subscription?.entity?.id,
          },
          {
            subscriptionStatus:
              webhookPayload?.payload?.subscription?.entity?.status,
            remainingCount:
              webhookPayload?.payload?.subscription?.entity?.remaining_count,
            expiryDate:
              webhookPayload?.payload?.subscription?.entity?.current_end ??
              undefined,
          },
        );

        if (updateCount) {
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
                'remainingCount',
              ],
            },
          );

          const totalPaid =
            subscriptionDetails.totalBillingCycle -
            (subscriptionDetails.remainingCount ??
              subscriptionDetails.totalBillingCycle);
          await this.subscriptionService.resetUsage(
            subscriptionDetails.user.id,
            subscriptionDetails,
            webhookPayload.payload?.payment ? true : false,
            totalPaid,
          );

          await this.cacheService.set(
            subscriptionDetails.user.id.toString(),
            subscriptionDetails.subscriptionStatus,
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
              user: subscriptionDetails.user.id,
              subscription: subscriptionDetails.id,
            });

            await this.em.persistAndFlush(paymentData);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
