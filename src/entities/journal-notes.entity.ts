import { Entity, ManyToOne, Property, DateType } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_journal_notes' })
export class JournalNotes extends BaseClass {
  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'varchar(255)' })
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @Property({ type: 'date' })
  date: DateType;

  @Property({ type: 'boolean' })
  isShared: boolean = false; // TODO: Don't need this.
}
