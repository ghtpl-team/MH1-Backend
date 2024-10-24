import { Controller, Get } from '@nestjs/common';
import { NewsCardsService } from './news-cards.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('news-cards')
@ApiTags('News Cards')
@ApiBearerAuth()
export class NewsCardsController {
  constructor(private readonly newsCardsService: NewsCardsService) {}

  @Get()
  async getNewsCards() {
    return await this.newsCardsService.fetchNewsCards();
  }
}
