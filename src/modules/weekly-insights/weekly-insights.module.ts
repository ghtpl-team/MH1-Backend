import { Module } from '@nestjs/common';
import { WeeklyInsightsController } from './weekly-insights.controller';
import { WeeklyInsightsService } from './weekly-insights.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [WeeklyInsightsController],
  providers: [WeeklyInsightsService, GraphQLClientService],
})
export class WeeklyInsightsModule {}
