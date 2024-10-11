import { ReminderType } from 'src/entities/schedules.entity';

export const SYSTEM_SETTING = {
  symptomReviewTime: 1000 * 60 * 60,
  dietReviewTime1: 1000 * 60 * 30,
  dietReviewTime2: 1000 * 60 * 30,
  defaultReminders: {
    [ReminderType.FITNESS_REMINDER]: '08:00:00',
    [ReminderType.WATER_REMINDER]: '06:00:00',
    [ReminderType.DIET_REMINDER]: '07:00:00',
    [ReminderType.SOUL_REMINDER]: '17:00:00',
    [ReminderType.MIND_REMINDER]: '20:00:00',
  },
};
