import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '2023-01-01',
    description: 'Expected due date',
    required: true,
    format: 'date',
  })
  @IsString()
  expectedDueDate: string;
}
