import { IntakeTime, MedicationStrengthUnit } from 'src/app.entities';

export interface MedicationScheduleResponseObj {
  [key: string]: {
    rank: number;
    intakeTiming: string;
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
