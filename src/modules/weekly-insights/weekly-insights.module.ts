import { Module } from '@nestjs/common';
import { WeeklyInsightsController } from './weekly-insights.controller';
import { WeeklyInsightsService } from './weekly-insights.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [WeeklyInsightsController],
  providers: [WeeklyInsightsService, GraphQLClientService, ConfigService],
})
export class WeeklyInsightsModule {}
