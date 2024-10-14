import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_user_impressions' })
export class UserImpressions extends BaseClass {
  @Property({ type: 'string' })
  postId: string;

  @ManyToOne(() => User)
  user: User;

  @Enum(() => ImpressionType)
  impressionType: ImpressionType;
}

export enum ImpressionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  LOVE = 'love',
  HAPPY = 'happy',
}
