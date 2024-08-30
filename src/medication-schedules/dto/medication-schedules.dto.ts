import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsDateString,
  IsOptional,
} from 'class-validator';
import {
  MedicationType,
  IntakeType,
  Frequency,
  IntakeTime,
  MedicationStrengthUnit,
  DaysOfWeek,
} from 'src/app.entities';

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
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateMedicationScheduleDto {
  @ApiProperty()
  @IsString()
  medicationName: string;

  @ApiProperty()
  @IsEnum(MedicationType)
  medicationType: MedicationType;

  @ApiProperty()
  @IsArray()
  intakeTime: IntakeTime[];

  @ApiProperty()
  @IsString()
  strength: string;

  @ApiProperty()
  @IsEnum(MedicationStrengthUnit)
  strengthUnit: MedicationStrengthUnit;

  @ApiProperty()
  @IsEnum(IntakeType)
  intakeType: IntakeType;

  @ApiProperty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  selectedDays?: DaysOfWeek[];

  @ApiProperty()
  @IsArray()
  intakeTimes: string[];

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}
