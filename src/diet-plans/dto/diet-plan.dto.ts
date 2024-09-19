import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  BloodSugarLevel,
  MedicalCondition,
  PregnancyComplications,
} from 'src/entities/medical-records.entity';
import { DietPreferences } from 'src/entities/user-preferences.entity';
import { ActivityLevel } from 'src/entities/user-profile.entity';

export class DietPlanInfoFormDto {
  @ApiProperty()
  @IsInt()
  @Min(18)
  @Max(120)
  age: number;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  bmi: number;

  @ApiProperty()
  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel: ActivityLevel;

  @ApiProperty()
  @IsEnum(MedicalCondition)
  @IsOptional()
  medicalCondition: MedicalCondition;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  onInsulin: boolean;

  @ApiProperty()
  @IsEnum(PregnancyComplications)
  @IsOptional()
  pregnancyComplications: PregnancyComplications;

  @ApiProperty()
  @IsEnum(BloodSugarLevel)
  @IsOptional()
  afterFastBloodSugarLevel: BloodSugarLevel;

  @ApiProperty()
  @IsEnum(BloodSugarLevel)
  @IsOptional()
  afterMealBloodSugarLevel: BloodSugarLevel;

  @ApiProperty()
  @IsEnum(BloodSugarLevel)
  @IsOptional()
  afterMealBloodSugarLevel2: BloodSugarLevel;

  @ApiProperty({ isArray: true })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ isArray: true })
  @IsArray()
  @IsOptional()
  avoidedFoods?: string[];

  @ApiProperty({ enum: DietPreferences })
  @IsEnum(DietPreferences)
  @IsOptional()
  dietPreferences: DietPreferences;
}
