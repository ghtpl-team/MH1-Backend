import { Module } from '@nestjs/common';
import { NewsCardsController } from './news-cards.controller';
import { NewsCardsService } from './news-cards.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [DayjsModule],
  controllers: [NewsCardsController],
  providers: [NewsCardsService, GraphQLClientService],
})
export class NewsCardsModule {}
