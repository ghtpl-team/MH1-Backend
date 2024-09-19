import {
  Entity,
  Enum,
  Property,
  Index,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

import { BaseClass } from './base.entity';
import { Subscriptions } from './subscriptions.entity';
import { CurrencyCode } from '../common/enums/razorpay.enums';

@Entity({ tableName: 'mh_subscription_plans' })
export class SubscriptionPlans extends BaseClass {
  @Enum({
    items: () => SubscriptionPlanPeriod,
    nativeEnumName: 'plan_period',
    nullable: false,
  })
  period: SubscriptionPlanPeriod;

  //This, combined with period, defines the frequency of the plan. If the billing cycle is 2 months, the value should be 2. For daily plans, the minimum value should be 7.
  @Property({ type: 'numeric', nullable: false })
  paymentInterval: number;

  @Property({ length: 150 })
  planName!: string;

  @Property()
  amountX100!: number;

  @Enum({
    items: () => CurrencyCode,
    nativeEnumName: 'currency_codes',
    nullable: false,
  })
  currencyCode!: CurrencyCode;

  @Property({ nullable: true, length: 300 })
  description?: string;

  @Property({ type: 'jsonb', nullable: true })
  notes?: Record<string, string>;

  @Property({ type: 'jsonb' })
  apiResponse: Record<string, string>;

  @Index()
  @Property({ nullable: true })
  razorPayPlanId?: string;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.plan)
  subscriptions = new Collection<Subscriptions>(this);
}

export enum SubscriptionPlanPeriod {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}
