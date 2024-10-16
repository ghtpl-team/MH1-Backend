import {
  Entity,
  Unique,
  ManyToOne,
  OneToMany,
  Collection,
  Property,
  Enum,
  Index,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { Schedule } from './schedules.entity';
import { User } from './user.entity';

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

  @BeforeCreate()
  @BeforeUpdate()
  validateArrayLengths() {
    if (this.intakeTimes.length !== this.intakeTime.length) {
      throw new Error(
        'The lengths of intakeTimes and intakeTime must be equal.',
      );
    }
  }

  @BeforeCreate()
  @BeforeUpdate()
  formatIntakeTimes() {
    this.intakeTimes = this.intakeTimes.map((time) => {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}:00`;
    });
  }
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
