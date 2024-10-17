import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserPreferencesDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  breakfastTiming: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lunchTiming: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dinnerTiming: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: 'must be a boolean' })
  isActivityLocked: boolean;
}
