import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { User } from './user.entity';
import { BaseClass } from './base.entity';

@Entity({ tableName: 'mh_bookmarked_articles' })
export class BookmarkedArticle extends BaseClass {
  @Property({ nullable: false })
  articleId: string;

  @ManyToOne(() => User)
  user!: User;
}
