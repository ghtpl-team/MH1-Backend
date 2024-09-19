import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_activity_feedbacks' })
export class ActivityFeedBack extends BaseClass {
  @ManyToOne(() => User)
  user!: User;

  @Property()
  experienceRating: number;

  @Property()
  difficultyRating: number;

  @Property()
  instructionRating: number;

  @Property()
  discomfort: string;
}
