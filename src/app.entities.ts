import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Enum,
  Collection,
  Unique,
  Index,
  OneToOne,
  DateType,
} from '@mikro-orm/core';

class BaseClass {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Enum()
  @Index()
  status: Status = Status.ACTIVE;
}

@Entity({ tableName: 'mh_users' })
export class User extends BaseClass {
  @Property({ unique: true })
  phone!: string;

  @OneToMany(() => MedicationSchedule, (schedule) => schedule.user)
  medicationSchedules = new Collection<MedicationSchedule>(this);

  @OneToMany(() => ActivityFeedBack, (feedback) => feedback.user)
  activityFeedbacks = new Collection<ActivityFeedBack>(this);

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules = new Collection<Schedule>(this);

  @OneToOne(() => UserPreferences, (userPreferences) => userPreferences.user, {
    orphanRemoval: true,
    cascade: [],
    fieldName: 'user_preference_id',
  })
  userPreferences = new UserPreferences();

  @OneToMany(() => JournalNotes, (journalNotes) => journalNotes.user, {
    orphanRemoval: true,
  })
  journalNotes = new Collection<JournalNotes>(this);

  @OneToMany(() => LoggedSymptoms, (logSymptom) => logSymptom.user)
  loggedSymptoms = new Collection<LoggedSymptoms>(this);
}

@Entity({ tableName: 'mh_user_preferences' })
export class UserPreferences extends BaseClass {
  @Property({ type: 'time' })
  beforeBreakFast?: string;

  @Property({ type: 'time' })
  afterBreakFast?: string;

  @Property({ type: 'time' })
  beforeLunch?: string;

  @Property({ type: 'time' })
  afterLunch?: string;

  @Property({ type: 'time' })
  beforeDinner?: string;

  @Property({ type: 'time' })
  afterDinner?: string;

  @Property({ type: 'time' })
  beforeBedTime?: string;

  @Property({ type: 'time' })
  wakeUpTime?: string;

  @Property({ type: 'time' })
  eveningSnacks?: string;

  @Property({ type: 'boolean' })
  isActivityLocked: boolean = false;

  @Property({ type: 'boolean' })
  isJournalLocked: boolean = false;

  @OneToOne(() => User)
  user!: User;
}

@Entity({ tableName: 'mh_medication_schedule' })
@Unique({ properties: ['user', 'medicationName'] })
export class MedicationSchedule extends BaseClass {
  @ManyToOne(() => User)
  user!: User;

  @Property()
  medicationName!: string;

  @Enum(() => MedicationType)
  medicationType!: MedicationType;

  @Property()
  strength!: string;

  @Enum(() => MedicationStrengthUnit)
  strengthUnit!: MedicationStrengthUnit;

  @Enum(() => IntakeType)
  intakeType!: IntakeType;

  @Property({ type: 'json' })
  intakeTime!: IntakeTime[];

  @Enum(() => Frequency)
  frequency!: Frequency;

  @Property({ type: 'json', nullable: true })
  selectedDays?: DaysOfWeek[];

  @Property({ type: 'json' })
  intakeTimes!: string[]; //specific times ['08:00', '13:00', '20:00']

  @Property({ type: 'date' })
  @Index()
  startDate!: string;

  @Property({ type: 'date' })
  @Index()
  endDate!: string;
}

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

@Entity({ tableName: 'mh_activity_feedbacks' })
export class ActivityFeedBack extends BaseClass {
  @ManyToOne(() => User)
  user!: User;

  @Property()
  experienceRating: number;

  @Property()
  difficultyRating: number;

  @Property()
  instructionRating: number;

  @Property()
  discomfort: string;
}
@Entity({ tableName: 'mh_schedules' })
export class Schedule extends BaseClass {
  @Property({ type: 'time' })
  reminderTime!: string;

  @Enum({ items: () => Frequency, nativeEnumName: 'frequency' })
  recurrenceRule: Frequency = Frequency.DAILY;

  @Enum({ items: () => ReminderType, nativeEnumName: 'reminder_type' })
  type!: ReminderType;

  @OneToMany(() => ScheduledTask, (scheduledTask) => scheduledTask.schedule)
  scheduledTasks = new Collection<ScheduledTask>(this);

  @ManyToOne(() => User)
  user!: User;
}

@Entity({ tableName: 'mh_scheduled_tasks' })
export class ScheduledTask extends BaseClass {
  @ManyToOne(() => Schedule)
  schedule!: Schedule;

  @Enum({ items: () => ScheduledTaskStatus, nativeEnumName: 'task_status' })
  taskStatus: ScheduledTaskStatus = ScheduledTaskStatus.PENDING;

  @Enum({ items: () => ReminderType, nativeEnumName: 'reminder_type' })
  type!: ReminderType;

  @Index()
  @Property({ type: 'date' })
  date: string = new Date().toISOString().slice(0, 10);
}

export enum MedicationType {
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  TABLET = 'tablet',
  TOPICAL = 'topical',
  CREAM = 'cream',
  DEVICE = 'device',
  DROPS = 'drops',
  FOAM = 'foam',
  GEL = 'gel',
  INHALER = 'inhaler',
  INJECTION = 'injection',
  LOTION = 'lotion',
  OINTMENT = 'ointment',
  PATCH = 'patch',
  POWDER = 'powder',
  SPRAY = 'spray',
  SUPPOSITORY = 'suppository',
}

export enum IntakeType {
  BEFORE_FOOD = 'before_food',
  AFTER_FOOD = 'after_food',
}

export enum IntakeTime {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}

export enum Frequency {
  DAILY = 'daily',
  EVERY_OTHER_DAY = 'every_other_day',
  EVERY_THIRD_DAY = 'every_third_day',
  EVERY_FOURTH_DAY = 'every_fourth_day',
  EVERY_FIFTH_DAY = 'every_fifth_day',
  SPECIFIC_DAYS = 'specific_days',
}

export enum ScheduledTaskStatus {
  PENDING = 'pending',
  TAKEN = 'taken',
  MISSED = 'missed',
}

export enum DaysOfWeek {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export enum MedicationStrengthUnit {
  MG = 'mg',
  MCG = 'mcg',
  GRAM = 'g',
  ML = 'ml',
  PERCENTAGE = 'percentage',
}

export enum ReminderType {
  MEDICATION_SCHEDULE = 'medication',
  SHARING_JOURNAL = 'journal',
  WATER_REMINDER = 'water',
  DIET_REMINDER = 'diet',
  SOUL_REMINDER = 'soul',
  MIND_REMINDER = 'mind',
  FITNESS_REMINDER = 'fitness',
}

export enum Status {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}
