import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FeedbackFromDto {
  @IsNumber()
  @ApiProperty()
  experienceRating: number;

  @IsNumber()
  @ApiProperty()
  difficultyRating: number;

  @IsNumber()
  @ApiProperty()
  instructionRating: number;

  @IsString()
  @ApiProperty()
  discomfort: string;
}
