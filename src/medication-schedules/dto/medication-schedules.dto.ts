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

export class DeleteMedicationScheduleDto {
  @ApiProperty()
  @IsArray()
  intakeTime: IntakeTime[];

  @ApiProperty()
  @IsArray()
  intakeTimes: string[];
}
