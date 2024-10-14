import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateCommentDto, CreateUserImpressionDto } from './dto/posts.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly PostsService: PostsService) {}

  @Post('impressions')
  @UseGuards(CustomAuthGuard)
  create(
    @Body() createUserImpressionDto: CreateUserImpressionDto,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    if (!userId) throw new HttpException('Unauthorized', 401);
    return this.PostsService.addUserImpression(
      parseInt(userId),
      createUserImpressionDto,
    );
  }

  @Get('impressions')
  @UseGuards(CustomAuthGuard)
  findAll(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('postId') postId: string,
  ) {
    if (!userId) throw new HttpException('Unauthorized', 401);
    return this.PostsService.findAll(parseInt(userId), postId);
  }

  @Post('comments')
  @UseGuards(CustomAuthGuard)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    if (!userId) throw new HttpException('Unauthorized', 401);
    return this.PostsService.createComment(parseInt(userId), createCommentDto);
  }

  @Get('comments')
  @UseGuards(CustomAuthGuard)
  findAllComments(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('postId') postId: string,
  ) {
    if (!userId) throw new HttpException('Unauthorized', 401);
    return this.PostsService.findAllComments(parseInt(userId), postId);
  }
}
