import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async getFilteredArticles(@Query('trimester') trimester: string) {
    return await this.articleService.getFilteredArticles(parseInt(trimester));
  }
}
