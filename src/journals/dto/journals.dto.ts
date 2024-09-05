import { DateType } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateJournalEntryDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsDateString()
  @ApiProperty()
  date?: DateType;
}

export class UpdateJournalSecurityDto {
  @IsBoolean()
  @ApiProperty()
  isLocked: boolean;
}
