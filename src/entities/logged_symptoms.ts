import { Entity, Index, Property, ManyToOne } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_logged_symptoms' })
export class LoggedSymptoms extends BaseClass {
  @Index()
  @Property({ type: 'date' })
  loggingDate: string = new Date().toISOString().slice(0, 10);

  @Property({ type: 'array' })
  symptoms: string[];

  @ManyToOne(() => User)
  user!: User;
}
