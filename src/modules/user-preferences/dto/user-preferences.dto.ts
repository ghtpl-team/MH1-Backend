import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

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
}
