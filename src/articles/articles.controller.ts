import { Controller, Get, Query } from '@nestjs/common';
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
}
