import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';
import { Subscriptions } from './subscriptions.entity';

@Entity({ tableName: 'mh_subscription_usage' })
export class SubscriptionUsage extends BaseClass {
  @OneToOne(() => User)
  user: User;

  @Property({ type: 'int', default: 0 })
  totalFreeBookings: number;

  @Property({ type: 'int', default: 0 })
  usedFreeBookings: number;

  @OneToOne(() => Subscriptions, { nullable: true })
  currentSubscription: Subscriptions;
}
