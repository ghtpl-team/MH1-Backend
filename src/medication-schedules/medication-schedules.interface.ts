import { MedicationStrengthUnit } from 'src/app.entities';

export interface MedicationScheduleResponseObj {
  [key: string]: {
    intakeTiming: string;
    schedule: Array<{
      name: string;
      strength: string;
      strengthUnit: MedicationStrengthUnit;
      isTaken: boolean;
    }>;
  };
}
