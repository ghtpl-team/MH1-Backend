import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_medical_records' })
export class MedicalRecord extends BaseClass {
  @Enum({ items: () => MedicalCondition })
  medicalCondition: MedicalCondition = MedicalCondition.NONE;

  @Property({ type: 'boolean', default: false })
  onInsulin: boolean = false;

  @Enum({ items: () => PregnancyComplications })
  pregnancyComplications: PregnancyComplications = PregnancyComplications.NONE;

  @Enum({ items: () => BloodSugarLevel })
  afterFastBloodSugar: BloodSugarLevel = BloodSugarLevel.NORMAL;

  @Enum({ items: () => BloodSugarLevel })
  afterMealBloodSugar1: BloodSugarLevel = BloodSugarLevel.NORMAL;

  @Enum({ items: () => BloodSugarLevel })
  afterMealBloodSugar2: BloodSugarLevel = BloodSugarLevel.NORMAL;

  @OneToOne({ entity: () => User, nullable: false })
  user!: User;
}

export enum MedicalCondition {
  NONE = 'none',
  DIABETES = 'diabetes',
  UNDERWEIGHT = 'underweight',
  HYPOTHYROID = 'hypothyroid',
  HYPERTHYROID = 'hyperthyroid',
  PCOD = 'pcod',
  OBESITY = 'obesity',
  OVERWEIGHT = 'overweight',
  OTHER = 'other',
}

export enum PregnancyComplications {
  NONE = 'none',
  GDM = 'gestational_diabetes_mellitus',
  HYPEREMESIS = 'hyperemesis',
  LOW_FOETAL_WEIGHT = 'low_expected_foetal_weight',
  OTHER = 'other',
}

export enum BloodSugarLevel {
  NORMAL = '95_to_105',
  HIGH = 'greater_than_105',
  LOW = 'less_than_95',
}
