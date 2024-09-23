import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class LogSymptomsDto {
  @IsArray()
  @ApiProperty()
  symptoms: string[];
}
