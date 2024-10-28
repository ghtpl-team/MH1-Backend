import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Subscriptions } from './subscriptions.entity';

@Entity({ tableName: 'mh_billing_ledger' })
export class BillingLedger extends BaseClass {
  @ManyToOne(() => Subscriptions)
  subscription!: Subscriptions;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @Property()
  @IsNumber()
  amount!: number;

  @Property()
  @IsNotEmpty()
  currency: string = 'INR';

  @Property({ type: 'jsonb', nullable: true })
  paymentResponse?: Record<string, any>;
}
