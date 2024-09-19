import { Entity, Property, OneToOne, Enum } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { User } from './user.entity';

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
