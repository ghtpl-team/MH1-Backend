import {
  Entity,
  ManyToOne,
  OneToMany,
  Collection,
  Property,
  Enum,
  Index,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { CronStatus } from './cron-status.entity';
import {
  MedicationSchedule,
  Frequency,
  DaysOfWeek,
} from './medication-schedule.entity';
import { ScheduledTask } from './scheduled-tasks.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_schedules' })
export class Schedule extends BaseClass {
  @ManyToOne(() => MedicationSchedule)
  medicationSchedule?: MedicationSchedule;

  @OneToMany(() => CronStatus, (cronJobStatus) => cronJobStatus.schedule)
  cronJobStatuses = new Collection<CronStatus>(this);

  @Property({ type: 'time' })
  reminderTime: string = '00:00:00';

  @Enum({ items: () => Frequency, nativeEnumName: 'frequency' })
  recurrenceRule: Frequency = Frequency.DAILY;

  @Property({ type: 'json', nullable: true })
  selectedDays?: DaysOfWeek[];

  @Index()
  @Enum({ items: () => ScheduledBy, nativeEnumName: 'scheduled_by' })
  scheduledBy: ScheduledBy = ScheduledBy.SYSTEM;

  @Index()
  @Enum({ items: () => ReminderType, nativeEnumName: 'reminder_type' })
  type!: ReminderType;

  @OneToMany(() => ScheduledTask, (scheduledTask) => scheduledTask.schedule)
  scheduledTasks = new Collection<ScheduledTask>(this);

  @ManyToOne(() => User)
  user!: User;
}

export enum ReminderType {
  MEDICATION_SCHEDULE = 'medication',
  JOURNAL_SCHEDULE = 'journal',
  WATER_REMINDER = 'water',
  DIET_REMINDER = 'diet',
  SOUL_REMINDER = 'soul',
  MIND_REMINDER = 'mind',
  FITNESS_REMINDER = 'fitness',
}

export enum ScheduledBy {
  USER = 'user',
  SYSTEM = 'system',
}
