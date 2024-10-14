import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_user_comments' })
export class UserComment extends BaseClass {
  @Property({ type: 'string' })
  postId: string;

  @ManyToOne(() => User)
  user: User;

  @Property({ type: 'string', nullable: false })
  commentText: string;

  @OneToMany(() => UserComment, 'parentComment')
  childComments = new Collection<UserComment>(this);

  @ManyToOne(() => UserComment, { nullable: true })
  parentComment?: UserComment;
}

export enum CommentImpressionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}
