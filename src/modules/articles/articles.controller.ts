import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ApiQuery } from '@nestjs/swagger';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  @ApiQuery({
    required: false,
    name: 'trimester',
    examples: {
      onlyFirstTrimester: { value: ['1'] },
      multipleTrimesters: { value: ['1', '3'] },
      all: { value: [] },
      all_v2: { value: ['1', '2', '3'] },
    },
  })
  @UseGuards(CustomAuthGuard)
  async getFilteredArticles(
    @Query(
      'trimester',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    trimester: string[],
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    let trimesterList = [1, 2, 3];
    if (trimester && trimester.length >= 0)
      trimesterList = trimester.map((trimester) => parseInt(trimester));
    return await this.articleService.getFilteredArticles(
      trimesterList,
      parseInt(userId),
    );
  }

  @Post('bookmark')
  @UseGuards(CustomAuthGuard)
  async bookmarkArticle(
    @Query('articleId') articleId: string,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    if (!articleId || !userId) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.articleService.bookmarkArticle(
      articleId,
      parseInt(userId),
    );
  }

  @Get('bookmarked')
  @UseGuards(CustomAuthGuard)
  async getBookmarkedArticles(@Headers('x-mh-v3-user-id') userId: string) {
    if (!userId) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.articleService.getBookmarkedArticles(parseInt(userId));
  }

  @Patch('bookmark')
  @UseGuards(CustomAuthGuard)
  async unBookmarkArticle(
    @Query('articleId') articleId: string,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    if (!articleId || !userId) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.articleService.unBookmarkArticle(
      articleId,
      parseInt(userId),
    );
  }
}
