import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateKickSessionDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsNumber()
  durationInSec: number;

  @ApiProperty()
  @IsNumber()
  kickCount: number;
}

export class UpdateKickSessionDto {
  @IsString()
  startTime: string;
}

export class DeleteKickSessionDto {
  @IsDateString()
  date: string;
}
