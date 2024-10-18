import {
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  Entity,
  Enum,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_medical_records' })
export class MedicalRecord extends BaseClass {
  @Enum({ items: () => MedicalCondition })
  medicalCondition: MedicalCondition[] = [];

  @Property({ type: 'boolean', default: false })
  onInsulin: boolean = false;

  @Enum({ items: () => PregnancyComplications })
  pregnancyComplications: PregnancyComplications[] = [];

  @Enum({ items: () => BloodSugarLevel })
  afterFastBloodSugar: BloodSugarLevel = BloodSugarLevel.NORMAL;

  @Enum({ items: () => BloodSugarLevel1 })
  afterMealBloodSugar1: BloodSugarLevel1 = BloodSugarLevel1.NORMAL;

  @Enum({ items: () => BloodSugarLevel2 })
  afterMealBloodSugar2: BloodSugarLevel2 = BloodSugarLevel2.NORMAL;

  @OneToOne({ entity: () => User, nullable: false })
  user!: User;

  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  cleanRequestBody() {
    this.medicalCondition = this.medicalCondition.filter(
      (item) => item !== MedicalCondition.NONE,
    );
    this.pregnancyComplications = this.pregnancyComplications.filter(
      (item) => item !== PregnancyComplications.NONE,
    );
  }
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

export enum BloodSugarLevel1 {
  NORMAL = '130_to_140',
  HIGH = 'greater_than_140',
  LOW = 'less_than_130',
}

export enum BloodSugarLevel2 {
  NORMAL = '120_to_130',
  HIGH = 'greater_than_130',
  LOW = 'less_than_120',
}
