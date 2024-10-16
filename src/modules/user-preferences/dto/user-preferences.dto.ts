import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserPreferencesDto {
  @ApiProperty()
  @IsString()
  breakfastTiming: string;

  @ApiProperty()
  @IsString()
  lunchTiming: string;

  @ApiProperty()
  @IsString()
  dinnerTiming: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: 'must be a boolean' })
  isActivityLocked: boolean;
}
