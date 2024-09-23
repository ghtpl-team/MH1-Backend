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
    return await this.weeklyInsightsService.fetchInsights(
      parseInt(weekNumber),
      insightType,
    );
  }

  @Get('notes/listing/:week')
  async fetchNoteCards(@Param('week') weekNumber: string) {
    return await this.weeklyInsightsService.fetchNoteCards(
      parseInt(weekNumber),
    );
  }
}
