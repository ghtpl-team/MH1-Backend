import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateKickSessionDto {
  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsNumber()
  durationInSec: number;

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
