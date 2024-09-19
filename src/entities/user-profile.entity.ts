import { Entity, Property, OneToOne, Enum } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_user_profile' })
export class UserProfile extends BaseClass {
  @Property({ type: 'numeric' })
  age: number;

  @Property({ type: 'numeric', comment: 'in cm' })
  height: number;

  @Property({ type: 'decimal', precision: 6, scale: 2, comment: 'in kg' })
  weight: number;

  @Property({ type: 'decimal', precision: 6, scale: 2, comment: 'in kg/m2' })
  bmi: number;

  @Enum({ items: () => ActivityLevel })
  activityLevel: ActivityLevel = ActivityLevel.NOT_ACTIVE;

  @OneToOne(() => User)
  user!: User;
}

export enum ActivityLevel {
  NOT_ACTIVE = 'not_active',
  WALKING_ONCE_A_DAY = 'walking_once_a_day',
  EXERCISE_FOUR_TIMES_A_WEEK = 'exercising_4_days_a_week',
  WALKING_REGULARLY = 'walking_regularly',
  EXERCISE_SIX_TIMES_A_WEEK = 'exercising_6_days_a_week',
}
