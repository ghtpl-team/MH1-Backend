import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ImpressionType } from 'src/entities/user-impressions.entity';

export class CreateUserImpressionDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  postId!: string;

  @IsEnum(ImpressionType, {
    message: 'Invalid impression type',
  })
  @ApiProperty()
  impressionType!: ImpressionType;

  @IsBoolean({ message: 'isLiked must be a boolean' })
  @IsOptional()
  @ApiProperty()
  isLiked: boolean;

  @IsBoolean({ message: 'isDisliked must be a boolean' })
  @IsOptional()
  @ApiProperty()
  isDisliked: boolean;
}

export class CreateCommentDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  commentText!: string;
}
