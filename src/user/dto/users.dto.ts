import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;
}
