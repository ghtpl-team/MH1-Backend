import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
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
  async getPregnancyCoachCard(
    @Query('week') weekNumber: string,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new HttpException('user id is required!', HttpStatus.BAD_REQUEST);
    }
    return this.activitiesService.fetchPersonalCoach(
      parseInt(weekNumber),
      parseInt(userId),
    );
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

  @Get('history')
  async dailyActivityHistory(@Query('userId') userId: string) {
    return this.activitiesService.fetchActivityHistory(parseInt(userId));
  }
}
