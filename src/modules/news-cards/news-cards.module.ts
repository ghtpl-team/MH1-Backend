import { Module } from '@nestjs/common';
import { NewsCardsController } from './news-cards.controller';
import { NewsCardsService } from './news-cards.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [NewsCardsController],
  providers: [NewsCardsService, GraphQLClientService],
})
export class NewsCardsModule {}
