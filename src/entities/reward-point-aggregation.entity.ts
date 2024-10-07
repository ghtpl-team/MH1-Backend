import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_reward_points_aggregate' })
@Unique({ properties: ['user', 'type'] })
export class RewardPointsAggregate extends BaseClass {
  @ManyToOne({ entity: () => User })
  user: User;

  @Index()
  @Enum(() => RewardPointsEarnedType)
  type!: RewardPointsEarnedType;

  @Property({ type: 'int' })
  points!: number;
}

export enum RewardPointsEarnedType {
  WATER_GOAL_ACHIEVED,
  NUTRITION_GOAL_ACHIEVED,
  SOUL_GOAL_ACHIEVED,
  FITNESS_GOAL_ACHIEVED,
  MIND_GOAL_ACHIEVED,
}
