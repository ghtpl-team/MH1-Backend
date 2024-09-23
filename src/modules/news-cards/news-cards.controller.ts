import { Controller, Get } from '@nestjs/common';
import { NewsCardsService } from './news-cards.service';

@Controller('news-cards')
export class NewsCardsController {
  constructor(private readonly newsCardsService: NewsCardsService) {}

  @Get()
  async getNewsCards() {
    return await this.newsCardsService.fetchNewsCards();
  }
}
