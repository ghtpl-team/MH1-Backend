import { BaseEntity, Entity, OneToOne, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity({ tableName: 'mh_user_consent' })
export class UserConsent extends BaseEntity {
  @OneToOne(() => User, { primary: true })
  user!: User;

  @Property({ type: 'date' })
  lastAcknowledgedAt!: string;
}
