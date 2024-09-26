import { Entity, ManyToOne, Index, Enum, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { Schedule, ReminderType } from './schedules.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_scheduled_tasks' })
export class ScheduledTask extends BaseClass {
  @ManyToOne(() => Schedule)
  schedule!: Schedule;

  @Index()
  @Enum({ items: () => ScheduledTaskStatus, nativeEnumName: 'task_status' })
  taskStatus: ScheduledTaskStatus = ScheduledTaskStatus.PENDING;

  @Index()
  @Enum({ items: () => ReminderType, nativeEnumName: 'reminder_type' })
  type!: ReminderType;

  @Index()
  @Property({ type: 'date' })
  date: string = new Date().toISOString().slice(0, 10);

  @ManyToOne(() => User)
  user!: User;
}

export enum ScheduledTaskStatus {
  PENDING = 'pending',
  DONE = 'done',
  MISSED = 'missed',
  NOT_SCHEDULED = 'not_scheduled',
}
