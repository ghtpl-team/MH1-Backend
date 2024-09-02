import { Controller, Get, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('mind')
  async mindActivities() {
    return this.activitiesService.fetchMindActivities();
  }

  @Get('fitness')
  async fitnessActivities(@Query('week') weekNumber: string) {
    return this.activitiesService.fetchFitnessActivities(parseInt(weekNumber));
  }
}
