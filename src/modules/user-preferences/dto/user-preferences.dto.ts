import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UserPreferencesDto {
  @ApiProperty()
  @IsDateString()
  breakfastTiming: string;

  @ApiProperty()
  @IsDateString()
  lunchTiming: string;

  @ApiProperty()
  @IsDateString()
  dinnerTiming: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: 'must be a boolean' })
  isActivityLocked: boolean;
}
