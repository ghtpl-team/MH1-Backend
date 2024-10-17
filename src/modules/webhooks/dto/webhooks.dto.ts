import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class WebhookCreateDto {
  @ApiProperty()
  @IsObject()
  events: Record<string, 0 | 1>;
}
