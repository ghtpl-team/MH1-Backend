/* The SubscriptionsService class in TypeScript handles creating new subscription plans, subscribing
users to plans, retrieving subscription details, and canceling subscriptions. */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import {
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from './dto/subscriptions.dto';
import { EntityManager, QueryOrder, raw } from '@mikro-orm/mysql';

import { CurrencyCode } from 'src/common/enums/razorpay.enums';
import {
  Subscriptions,
  SubscriptionStatus,
} from 'src/entities/subscriptions.entity';
import {
  SubscriptionPlans,
  SubscriptionPlanPeriod,
} from 'src/entities/subscripton-plan.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly razorPayService: RazorpayService,
    private readonly em: EntityManager,
  ) {}

  async createNewPlan(createPlanDto: SubscriptionPlanDto) {
    try {
      const planDetails = await this.razorPayService.createPlan(createPlanDto);

      const savedPlan = this.em.create(SubscriptionPlans, {
        razorPayPlanId: planDetails.id,
        currencyCode: planDetails?.item?.currency as CurrencyCode,
        amountX100: createPlanDto.amountX100,
        planName: planDetails?.item?.name,
        period: planDetails.period as SubscriptionPlanPeriod,
        paymentInterval: planDetails.interval,
        apiResponse: planDetails,
      });
      await this.em.flush();
      return savedPlan;
    } catch (error) {
      throw error;
    }
  }

  async subscribe(subscriptionDto: CreateSubscriptionDto, userId: number) {
    try {
      const plan = await this.em.findOneOrFail(
        SubscriptionPlans,
        {
          id: parseInt(subscriptionDto.planId),
        },
        { populate: ['razorPayPlanId'] },
      );
      const subscriptionData = await this.razorPayService.createSubscription({
        ...subscriptionDto,
        planId: plan.razorPayPlanId,
      });

      const savedSubscriptionInfo = this.em.create(Subscriptions, {
        apiResponse: subscriptionData,
        plan: subscriptionDto.planId,
        razorPaySubscriptionId: subscriptionData.id,
        subscriptionStatus: subscriptionData.status as SubscriptionStatus,
        subscriptionUrl: subscriptionData.short_url,
        totalBillingCycle: subscriptionData.total_count,
        user: userId,
      });

      await this.em.flush();

      return savedSubscriptionInfo;
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionDetails(userId: number) {
    try {
      const qb = this.em.createQueryBuilder(Subscriptions, 'sub');

      const subscriptionInfo = await qb
        .select([
          'subscriptionStatus',
          'id',
          'subscriptionUrl',
          raw(`JSON_VALUE(sub.api_response, "$.charge_at") as renewsAt`),
        ])
        .leftJoinAndSelect('sub.plan', 'pl', {}, [
          'pl.id',
          'pl.planName',
          'pl.amountX100',
        ])
        .where({
          user: userId,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
        })
        .orderBy({
          createdAt: QueryOrder.DESC,
        })
        .limit(1)
        .execute();

      if (!subscriptionInfo) {
        throw new HttpException('No active subscription', HttpStatus.NOT_FOUND);
      }

      return subscriptionInfo;
    } catch (error) {
      throw error;
    }
  }

  async cancel(userId: number) {
    try {
      const subscriptionData = await this.em.findOne(Subscriptions, {
        user: userId,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      if (!subscriptionData)
        throw new HttpException('No active subscription', HttpStatus.NOT_FOUND);

      const updateRpSubscription =
        await this.razorPayService.cancelSubscription(
          subscriptionData.razorPaySubscriptionId,
        );

      return updateRpSubscription;
    } catch (error) {
      return error;
    }
  }
}
