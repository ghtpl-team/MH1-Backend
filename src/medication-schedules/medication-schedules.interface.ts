import { IntakeTime, MedicationStrengthUnit } from 'src/app.entities';

export interface MedicationScheduleResponseObj {
  [key: string]: {
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
