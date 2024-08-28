import { Controller, Get, Param } from '@nestjs/common';
import { WeeklyInsightsService } from './weekly-insights.service';

@Controller('weekly-insights')
export class WeeklyInsightsController {
  constructor(private readonly weeklyInsightsService: WeeklyInsightsService) {}

  @Get(':week')
  async fetchWeeklyInsights(@Param('week') weekNumber: number) {
    return await this.weeklyInsightsService.fetch(weekNumber);
  }
}
