import {
  MedicationStrengthUnit,
  IntakeTime,
} from 'src/entities/medication-schedule.entity';

export interface MedicationScheduleResponseObj {
  [key: string]: {
    rank: number;
    tabIcon: string;
    intakeTiming: string;
    reminderInfo: { id: number; time: string } | Record<string, any>;
    schedule: Array<{
      id: number;
      name: string;
      strength: string;
      strengthUnit: MedicationStrengthUnit;
      isTaken: boolean;
      timing: any;
      intakeTime: IntakeTime[];
      intakeTimes: string[];
    }>;
  };
}

export enum TimeSlot {
  'Before Breakfast',
  'After Breakfast',
  'Before Lunch',
  'After Lunch',
  'Before Dinner',
  'After Dinner',
}
