import { RewardPointsEarnedType } from 'src/entities/reward-point-aggregation.entity';
import { ReminderType } from 'src/entities/schedules.entity';

export const SYSTEM_SETTING = {
  symptomReviewTime: 1000 * 60 * 60,
  dietReviewTime1: 1000 * 60 * 30,
  dietReviewTime2: 1000 * 60 * 30,
  freeBookingCount: 2,
  defaultReminders: {
    [ReminderType.FITNESS_REMINDER]: '08:00:00',
    [ReminderType.WATER_REMINDER]: '06:00:00',
    [ReminderType.DIET_REMINDER]: '07:00:00',
    [ReminderType.SOUL_REMINDER]: '17:00:00',
    [ReminderType.MIND_REMINDER]: '20:00:00',
  },
  activityPoints: {
    [RewardPointsEarnedType.WATER_GOAL_ACHIEVED]: 10,
    [RewardPointsEarnedType.FITNESS_GOAL_ACHIEVED]: 10,
    [RewardPointsEarnedType.MIND_GOAL_ACHIEVED]: 10,
    [RewardPointsEarnedType.NUTRITION_GOAL_ACHIEVED]: 10,
    [RewardPointsEarnedType.SOUL_GOAL_ACHIEVED]: 10,
  },
};
