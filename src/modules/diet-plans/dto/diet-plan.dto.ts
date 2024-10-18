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
  BloodSugarLevel1,
  BloodSugarLevel2,
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
  physicalActivity: ActivityLevel;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  medicalCondition: MedicalCondition[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  onInsulin: boolean;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  pregnancyComplications: PregnancyComplications[];

  @ApiProperty()
  @IsEnum(BloodSugarLevel)
  @IsOptional()
  afterFastBloodSugarLevel: BloodSugarLevel;

  @ApiProperty()
  @IsEnum(BloodSugarLevel1)
  @IsOptional()
  afterMealBloodSugarLevel: BloodSugarLevel1;

  @ApiProperty()
  @IsEnum(BloodSugarLevel2)
  @IsOptional()
  afterMealBloodSugarLevel2: BloodSugarLevel2;

  @ApiProperty({ isArray: true })
  @IsArray()
  @IsOptional()
  foodAllergies?: string[];

  @ApiProperty({ isArray: true })
  @IsArray()
  @IsOptional()
  avoidedIngredients?: string[];

  @ApiProperty({ enum: DietPreferences })
  @IsEnum(DietPreferences)
  @IsOptional()
  dietPreference: DietPreferences;
}
