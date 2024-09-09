import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Frequency, ReminderType } from 'src/app.entities';

export class ReminderCreateReqDto {
  @ApiProperty()
  @IsString()
  reminderTime: string;

  @ApiProperty()
  @IsEnum(Frequency)
  recurrenceRule?: Frequency;

  @ApiProperty()
  @IsEnum(ReminderType)
  type: ReminderType;
}
