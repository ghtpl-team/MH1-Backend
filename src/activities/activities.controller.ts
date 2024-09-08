import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { FeedbackFromDto } from './dto/activities.dto';

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

  @Get('overview')
  async getPregnancyCoachCard(@Query('week') weekNumber: string) {
    return this.activitiesService.fetchPersonalCoach(parseInt(weekNumber));
  }

  @Get('feedback')
  async getFeedbackForm() {
    return this.activitiesService.getFeedbackForm();
  }

  @Post('feedback')
  async recordFeedBack(
    @Body() feedbackFormDto: FeedbackFromDto,
    @Query('userId') userId: string,
  ) {
    return this.activitiesService.recordFeedback(
      feedbackFormDto,
      parseInt(userId),
    );
  }
}
