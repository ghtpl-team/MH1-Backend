import {
  Entity,
  ManyToOne,
  Property,
  Index,
  Enum,
  OneToOne,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { SubscriptionPlans } from './subscripton-plan.entity';
import { User } from './user.entity';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { SubscriptionUsage } from './subscription-usage.entity';

@Entity({ tableName: 'mh_subscriptions' })
export class Subscriptions extends BaseClass {
  @ManyToOne(() => SubscriptionPlans)
  @IsNotEmpty()
  plan!: SubscriptionPlans;

  @Property({ type: 'numeric' })
  @IsInt()
  @Min(1)
  totalBillingCycle!: number;

  @Property()
  notifyCustomer?: boolean;

  @Property({ type: 'jsonb', nullable: true })
  notes?: Record<string, string>;

  @Index()
  @Enum({
    items: () => SubscriptionStatus,
    nativeEnumName: 'subscription_status',
  })
  subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;

  @Index()
  @Property({ nullable: false })
  razorPaySubscriptionId: string;

  @Property({ type: 'jsonb', nullable: true })
  apiResponse: Record<string, string>;

  @Property({ nullable: false })
  subscriptionUrl: string;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(
    () => SubscriptionUsage,
    (subscriptionUsage) => subscriptionUsage.currentSubscription,
  )
  subscriptionUsage: SubscriptionUsage;
}

export enum SubscriptionStatus {
  CREATED = 'created',
  AUTHENTICATED = 'authenticated',
  ACTIVE = 'active',
  PENDING = 'pending',
  HALTED = 'halted',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}
