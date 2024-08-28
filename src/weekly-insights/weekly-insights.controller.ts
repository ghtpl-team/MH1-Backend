import { Controller, Get, Param, Query } from '@nestjs/common';
import { WeeklyInsightsService } from './weekly-insights.service';
import { InsightType } from './weekly-insights.interface';

@Controller('weekly-insights')
export class WeeklyInsightsController {
  constructor(private readonly weeklyInsightsService: WeeklyInsightsService) {}

  @Get(':week')
  async fetchWeeklyInsights(
    @Param('week') weekNumber: string,
    @Query('insightType') insightType: InsightType,
  ) {
    return await this.weeklyInsightsService.fetch(
      parseInt(weekNumber),
      insightType,
    );
  }
}
