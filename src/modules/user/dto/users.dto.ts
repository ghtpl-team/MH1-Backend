import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '2023-01-01',
    description: 'Expected due date',
    required: true,
    format: 'date',
  })
  @IsString()
  expectedDueDate: string;

  @ApiProperty({
    example: '649902000000000000000000',
    description: 'Mongo ID',
    required: true,
  })
  @IsString()
  mongoId: string;
}

export enum Operation {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}
export class SubscriptionUsageUpdateDto {
  @ApiProperty({
    example: 'increase',
    description: 'Operation',
    required: true,
  })
  @IsEnum(Operation)
  operation: Operation;
}
