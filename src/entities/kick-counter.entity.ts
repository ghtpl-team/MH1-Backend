import { Entity, Index, Property, ManyToOne } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_kick_counter' })
export class KickCounter extends BaseClass {
  @Index()
  @Property({ type: 'date' })
  date: string;

  @Property({ type: 'time' })
  startTime: string;

  @Property({ type: 'int' })
  durationInSec: number;

  @Property({ type: 'int' })
  kickCount: number;

  @ManyToOne(() => User)
  user!: User;
}
