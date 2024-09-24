import { Controller, Get, Query } from '@nestjs/common';
import { WeeklyInsightsService } from './weekly-insights.service';
import { InsightType } from './weekly-insights.interface';
import { Week } from 'src/decorators/week/week.decorator';

@Controller('weekly-insights')
export class WeeklyInsightsController {
  constructor(private readonly weeklyInsightsService: WeeklyInsightsService) {}

  @Get(':week')
  async fetchWeeklyInsights(
    @Week() weekNumber: number,
    @Query('insightType') insightType: InsightType,
  ) {
    return await this.weeklyInsightsService.fetchInsights(
      weekNumber,
      insightType,
    );
  }

  @Get('notes/listing/:week')
  async fetchNoteCards(@Week() weekNumber: number) {
    return await this.weeklyInsightsService.fetchNoteCards(weekNumber);
  }
}
