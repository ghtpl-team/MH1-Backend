import { Entity, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';

@Entity()
export class WebhookEvents extends BaseClass {
  @Property()
  eventId!: string;

  @Property()
  event!: string;

  @Property({ type: 'json' })
  payload!: any;
}
