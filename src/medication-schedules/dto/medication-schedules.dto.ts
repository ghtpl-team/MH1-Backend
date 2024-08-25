import { IsString, IsEnum, IsArray, IsDateString, IsOptional, isEnum, IsNumber } from 'class-validator';
import { MedicationType, IntakeType, Frequency, IntakeTime, MedicationStrengthUnit, DaysOfWeek, User } from 'src/app.entities';

export class CreateMedicationScheduleDto {
  @IsString()
  medicationName: string;

  @IsEnum(MedicationType)
  medicationType: MedicationType;

  @IsArray()
  intakeTime: IntakeTime[];

  @IsString()
  strength: string;

  @IsEnum(MedicationStrengthUnit)
  strengthUnit: MedicationStrengthUnit;

  @IsEnum(IntakeType)
  intakeType: IntakeType;

  @IsEnum(Frequency)
  frequency: Frequency;

  @IsArray()
  @IsOptional()
  selectedDays?: DaysOfWeek[];

  @IsArray()
  intakeTimes: string[];

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}