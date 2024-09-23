import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DaysOfWeek } from 'src/entities/medication-schedule.entity';

export class ReminderCreateReqDto {
  @ApiProperty()
  @IsString()
  reminderTime: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    isArray: true,
    enum: DaysOfWeek,
    required: false,
  })
  @IsOptional()
  @IsEnum(DaysOfWeek, { each: true })
  selectedDays?: DaysOfWeek[];
}
