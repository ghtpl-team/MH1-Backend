import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_activity_watch_history' })
export class ActivityWatchHistory extends BaseClass {
  @Property({ type: 'array' })
  history: string[];

  @Property({ type: 'date' })
  date: string = new Date().toISOString().split('T')[0];

  @Enum({ items: () => ActivityType, nativeEnumName: 'activity_type' })
  type: ActivityType;

  @ManyToOne(() => User)
  user: User;
}

export enum ActivityType {
  MIND = 'mind',
  FITNESS = 'fitness',
  WATER = 'water',
  NUTRITION = 'nutrition',
  SOUL = 'soul',
}
