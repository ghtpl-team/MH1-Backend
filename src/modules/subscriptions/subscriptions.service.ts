/* The SubscriptionsService class in TypeScript handles creating new subscription plans, subscribing
users to plans, retrieving subscription details, and canceling subscriptions. */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import {
  CancelSubscriptionDto,
  CreateSubscriptionDto,
  SubscriptionPlanDto,
  UpdateSubscriptionDto,
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
import { SubscriptionUsage } from 'src/entities/subscription-usage.entity';
import { Status } from 'src/entities/base.entity';
import { Operation } from '../user/dto/users.dto';
import { SYSTEM_SETTING } from 'src/configs/system.config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger();
  constructor(
    private readonly razorPayService: RazorpayService,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
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
      const existingActiveSub = await this.em.findOne(Subscriptions, {
        status: Status.ACTIVE,
        user: userId,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      if (existingActiveSub) {
        throw new MethodNotAllowedException(
          'User already has an active subscription',
        );
      }

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
        remainingCount: parseInt(subscriptionData?.remaining_count ?? '0'),
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

  async cancel(userId: number, cancelSubscriptionDto: CancelSubscriptionDto) {
    try {
      let subscriptionData = await this.em.findOne(Subscriptions, {
        user: userId,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      if (!subscriptionData) {
        this.logger.debug('Waiting for subscription to become active');
        // Wait for 60 seconds (adjust time as needed)
        await new Promise((resolve) => setTimeout(resolve, 60000));

        // Try one more time after delay
        subscriptionData = await this.em.findOne(Subscriptions, {
          user: userId,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
        });

        if (!subscriptionData) {
          throw new Error('Subscription not found after waiting');
        }
      }
      const updateRpSubscription =
        await this.razorPayService.cancelSubscription(
          subscriptionData.razorPaySubscriptionId,
        );

      const updatedSubscription = await this.em.nativeUpdate(
        Subscriptions,
        {
          id: subscriptionData.id,
        },
        {
          updatedAt: new Date(),
          reasonOfCancellation: cancelSubscriptionDto.reasonOfCancellation,
        },
      );

      await this.cacheService.set(
        userId.toString(),
        SubscriptionStatus.CANCELLED,
        3000000,
      );

      console.log(
        'subscription update status',
        updatedSubscription,
        updateRpSubscription,
      );

      await this.em.flush();
      return updateRpSubscription;
    } catch (error) {
      this.logger.error(
        'error occurred while canceling the subscription',
        error?.stack || error,
      );
      return error;
    }
  }

  async updateUsage(userId: number, updateUsageDto: any) {
    try {
      const usageData = await this.em.findOne(SubscriptionUsage, {
        user: userId,
        status: Status.ACTIVE,
      });

      if (!usageData) {
        throw new HttpException('No data available', HttpStatus.NOT_FOUND);
      }

      const maxLimit = Math.min(
        usageData.eligibleFreeBookings,
        usageData.totalFreeBookings,
      );
      const operation = updateUsageDto.operation;
      let currentUsage = usageData.usedFreeBookings;

      if (operation === Operation.INCREASE) {
        if (currentUsage + 1 >= maxLimit) {
          return {
            success: false,
            message: 'You have reached the maximum limit',
          };
        }
        currentUsage++;
      } else {
        if (currentUsage - 1 < 0) {
          return {
            success: false,
            message: 'You have reached the minimum limit',
          };
        }
        currentUsage--;
      }
      await this.em.nativeUpdate(
        SubscriptionUsage,
        {
          user: userId,
        },
        {
          updatedAt: new Date(),
          usedFreeBookings: currentUsage,
          eligibleFreeBookings: 0,
        },
      );
      return {
        success: true,
        message: 'updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error while updating usage for user ${userId}`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async resetUsage(
    userId: number,
    subscription: Subscriptions,
    newPayment: boolean,
    totalPaid: number,
  ) {
    try {
      const { subscriptionStatus } = subscription;
      const totalUsage =
        subscriptionStatus === SubscriptionStatus.ACTIVE
          ? SYSTEM_SETTING.freeBookingCount
          : 0;
      const updateUsage = await this.em.nativeUpdate(
        SubscriptionUsage,
        {
          user: userId,
        },
        {
          ...(subscriptionStatus === SubscriptionStatus.COMPLETED && {
            usedFreeBooking: 0,
          }),
          totalFreeBookings: totalUsage,
          ...(newPayment && {
            eligibleFreeBookings: Math.min(2, Math.max(1, totalPaid)),
          }),
          currentSubscription: subscription.id,
          updatedAt: new Date(),
        },
      );

      if (!updateUsage)
        throw new HttpException(
          'Error while updating usage',
          HttpStatus.NOT_FOUND,
        );
      return updateUsage;
    } catch (error) {
      this.logger.error(
        `Error while updating usage for user ${userId}`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async update(
    userId: number,
    rpSubscriptionId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    try {
      const updateSubscription = await this.em.nativeUpdate(
        Subscriptions,
        {
          razorPaySubscriptionId: rpSubscriptionId,
          status: Status.ACTIVE,
          user: userId,
        },
        {
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          updatedAt: new Date(),
        },
      );

      console.log(updateSubscriptionDto);

      return {
        success: true,
        rowUpdated: updateSubscription,
      };
    } catch (error) {
      this.logger.error("can't set subscription to active");
      throw error;
    }
  }
}
