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
import { CurrencyCode } from './common/enums/razorpay.enums';

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
  @Index()
  @Property({ unique: true })
  phone!: string;

  @OneToMany(() => MedicationSchedule, (schedule) => schedule.user)
  medicationSchedules = new Collection<MedicationSchedule>(this);

  @OneToMany(() => ActivityFeedBack, (feedback) => feedback.user)
  activityFeedbacks = new Collection<ActivityFeedBack>(this);

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules = new Collection<Schedule>(this);

  @OneToMany(() => ScheduledTask, (scheduleTask) => scheduleTask.user)
  scheduledTasks = new Collection<Schedule>(this);

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

  @OneToMany(() => Subscriptions, (subscription) => subscription.user)
  subscription = new Collection<Subscriptions>(this);
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

  @OneToMany(() => Schedule, (schedule) => schedule.medicationSchedule, {})
  schedule = new Collection<Schedule>(this);

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

@Entity({ tableName: 'mh_subscription_plans' })
export class SubscriptionPlans extends BaseClass {
  @Enum({
    items: () => SubscriptionPlanPeriod,
    nativeEnumName: 'plan_period',
    nullable: false,
  })
  period: SubscriptionPlanPeriod;

  //This, combined with period, defines the frequency of the plan. If the billing cycle is 2 months, the value should be 2. For daily plans, the minimum value should be 7.
  @Property({ type: 'numeric', nullable: false })
  paymentInterval: number;

  @Property({ length: 150 })
  planName!: string;

  @Property()
  amountX100!: number;

  @Enum({
    items: () => CurrencyCode,
    nativeEnumName: 'currency_codes',
    nullable: false,
  })
  currencyCode!: CurrencyCode;

  @Property({ nullable: true, length: 300 })
  description?: string;

  @Property({ type: 'jsonb', nullable: true })
  notes?: Record<string, string>;

  @Property({ type: 'jsonb' })
  apiResponse: Record<string, string>;

  @Index()
  @Property({ nullable: true })
  razorPayPlanId?: string;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.plan)
  subscriptions = new Collection<Subscriptions>(this);
}

@Entity({ tableName: 'mh_subscriptions' })
export class Subscriptions extends BaseClass {
  @ManyToOne(() => SubscriptionPlans)
  plan!: SubscriptionPlans;

  @Property({ type: 'numeric' })
  totalBillingCycle!: number;

  @Property()
  notifyCustomer?: boolean;

  @Property({ type: 'jsonb', nullable: true })
  notes?: Record<string, string>;

  @Index()
  @Enum({
    items: () => SubscriptionStatus,
    nativeEnumName: 'subscription_status',
  })
  subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;

  @Index()
  @Property({ nullable: false })
  razorPaySubscriptionId: string;

  @Property({ type: 'jsonb' })
  apiResponse: Record<string, string>;

  @Property({ nullable: false })
  subscriptionUrl: string;

  @ManyToOne(() => User)
  user: User;
}

@Entity({ tableName: 'mh_cron_job_status' })
export class CronStatus extends BaseClass {
  @ManyToOne(() => Schedule)
  schedule!: Schedule;

  @Index()
  @Property({ type: 'date' })
  date: string = new Date().toISOString().slice(0, 10);

  @Enum({ items: () => CronJobStatus, nativeEnumName: 'cron_job_status' })
  cronStatus: CronJobStatus = CronJobStatus.SUCCESS;

  @Property({ type: 'text', nullable: true })
  errorMessage?: string;
}

export enum CronJobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
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
  DONE = 'done',
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
  JOURNAL_SCHEDULE = 'journal',
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

export enum ScheduledBy {
  USER = 'user',
  SYSTEM = 'system',
}

export enum SubscriptionPlanPeriod {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum SubscriptionStatus {
  CREATED = 'created',
  AUTHENTICATED = 'authenticated',
  ACTIVE = 'active',
  PENDING = 'pending',
  HALTED = 'halted',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
}
