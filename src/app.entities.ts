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

  @OneToOne(() => UserPreferences, (userPreferences) => userPreferences.user, {
    orphanRemoval: true,
    cascade: [],
    fieldName: 'user_preference_id',
  })
  public userPreferences?: any;

  @OneToMany(() => JournalNotes, (journalNotes) => journalNotes.user, {
    orphanRemoval: true,
  })
  journalNotes = new Collection<JournalNotes>(this);

  @OneToOne(() => JournalSecurity, (journalSecurity) => journalSecurity.user, {
    orphanRemoval: true,
  })
  journalSecurity = new JournalSecurity();
}

@Entity({ tableName: 'mh_user_preferences' })
export class UserPreferences extends BaseClass {
  @Property({ type: 'time' })
  beforeBreakFast!: string;

  @Property({ type: 'time' })
  afterBreakFast!: string;

  @Property({ type: 'time' })
  beforeLunch!: string;

  @Property({ type: 'time' })
  afterLunch!: string;

  @Property({ type: 'time' })
  beforeDinner!: string;

  @Property({ type: 'time' })
  afterDinner!: string;

  @Property({ type: 'time' })
  beforeBedTime!: string;

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
  startDate!: DateType;

  @Property({ type: 'date' })
  @Index()
  endDate!: DateType;
  @OneToMany(() => Reminder, (reminder) => reminder.medicationSchedule)
  reminders = new Collection<Reminder>(this);
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

  @OneToOne(() => Reminder, (reminder) => reminder.journalNote)
  reminder?: number;
}

@Entity({ tableName: 'mh_journal_security' })
export class JournalSecurity extends BaseClass {
  @OneToOne(() => User)
  user!: User;

  @Property()
  isLocked: boolean = false;
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

@Entity({ tableName: 'mh_reminders' })
export class Reminder extends BaseClass {
  @ManyToOne(() => MedicationSchedule)
  medicationSchedule!: MedicationSchedule;

  @OneToOne(() => JournalNotes)
  journalNote!: JournalNotes;

  @Property()
  reminderTime!: Date;

  @Enum(() => ReminderStatus)
  reminderStatus!: ReminderStatus;

  @Enum({ items: () => ReminderType, nativeEnumName: 'reminder_type' })
  type!: ReminderType;
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

export enum ReminderStatus {
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
  MEDICATION_SCHEDULE,
  SHARING_JOURNAL,
}

export enum Status {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}
