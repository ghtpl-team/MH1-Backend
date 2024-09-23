import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async getFilteredArticles(@Query('trimester') trimester: string[]) {
    let trimesterList = [1, 2, 3];
    if (trimester && trimester.length >= 0)
      trimesterList = trimester.map((trimester) => parseInt(trimester));
    return await this.articleService.getFilteredArticles(trimesterList);
  }

  @Post('bookmark')
  async bookmarkArticle(
    @Query('articleId') articleId: string,
    @Query('userId') userId: string,
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
  async getBookmarkedArticles(@Query('userId') userId: string) {
    if (!userId) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.articleService.getBookmarkedArticles(parseInt(userId));
  }

  @Patch('bookmark')
  async unBookmarkArticle(
    @Query('articleId') articleId: string,
    @Query('userId') userId: string,
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
