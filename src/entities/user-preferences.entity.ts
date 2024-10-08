import { Entity, Property, OneToOne, Enum } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

@Entity({ tableName: 'mh_user_preferences' })
export class UserPreferences extends BaseClass {
  @Property({ type: 'time' })
  breakfastTime?: string;

  @Property({ type: 'time' })
  lunchTime?: string;

  @Property({ type: 'time' })
  dinnerTime?: string;

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

  @Enum({ items: () => LifeStages, nullable: false })
  lifeStage: LifeStages = LifeStages.PREGNANT;

  @Enum({ items: () => DietPreferences, default: 'none', nullable: false })
  dietPreference?: DietPreferences = DietPreferences.NONE;

  @Property({ type: 'jsonb', nullable: true })
  allergies?: string[];

  @Property({ type: 'jsonb', nullable: true })
  avoidedFoods?: string[];

  @OneToOne(() => User)
  user!: User;
}

export enum DietPreferences {
  NONE = 'none',
  VEGETARIAN = 'veg',
  VEGAN = 'vegan',
  NON_VEGETARIAN = 'non_veg',
  VEGETARIAN_WITH_EGG = 'veg_with_egg',
}

export enum LifeStages {
  PREGNANT = 'pregnant',
  MOTHER = 'mother',
  TRYING_TO_CONCEIVE = 'trying_to_conceive',
  TRACK_PERIOD = 'track_period',
}
