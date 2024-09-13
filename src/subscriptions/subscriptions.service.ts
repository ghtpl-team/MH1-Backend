import { Injectable } from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import {
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from './dto/subscriptions.dto';
import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import {
  SubscriptionPlanPeriod,
  SubscriptionPlans,
  Subscriptions,
  SubscriptionStatus,
} from 'src/app.entities';
import { CurrencyCode } from 'src/common/enums/razorpay.enums';

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
      const subscriptionInfo = await this.em
        .createQueryBuilder(Subscriptions, 'sub')
        .select(['subscriptionStatus', 'id', 'subscriptionUrl'])
        .leftJoinAndSelect('sub.plan', 'pl', {}, [
          'pl.id',
          'pl.planName',
          'pl.amountX100',
        ])
        .where({
          user: userId,
        })
        .orderBy({
          createdAt: QueryOrder.DESC,
        })
        .limit(1);
      return subscriptionInfo;
    } catch (error) {
      throw error;
    }
  }
}
