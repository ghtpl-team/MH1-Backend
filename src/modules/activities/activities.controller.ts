import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { FeedbackFromDto } from './dto/activities.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('mind')
  async mindActivities() {
    return this.activitiesService.fetchMindActivities();
  }

  @Get('fitness')
  @UseGuards(CustomAuthGuard)
  async fitnessActivities(
    @Query('week') weekNumber: string,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    return this.activitiesService.fetchFitnessActivities(
      parseInt(weekNumber),
      parseInt(userId),
    );
  }

  @Post('fitness/consent')
  @UseGuards(CustomAuthGuard)
  async consentFitnessActivities(@Headers('x-mh-v3-user-id') userId: string) {
    return this.activitiesService.acknowledgeConsentForm(parseInt(userId));
  }

  @UseGuards(CustomAuthGuard)
  @Get('overview')
  async getPregnancyCoachCard(
    @Query('week') weekNumber: string,
    @Headers('x-mh-v3-user-id') userId: string,
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
  @UseGuards(CustomAuthGuard)
  async recordFeedBack(
    @Body() feedbackFormDto: FeedbackFromDto,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    return this.activitiesService.recordFeedback(
      feedbackFormDto,
      parseInt(userId),
    );
  }

  @Get('history')
  @UseGuards(CustomAuthGuard)
  async dailyActivityHistory(@Headers('x-mh-v3-user-id') userId: string) {
    return this.activitiesService.fetchActivityHistory(parseInt(userId));
  }

  @Patch('status')
  @UseGuards(CustomAuthGuard)
  async updateActivityStatus(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('taskId') taskId: string,
  ) {
    if (!taskId || !userId)
      throw new HttpException('task id is required', HttpStatus.BAD_REQUEST);
    return this.activitiesService.updateActivityStatus(
      parseInt(userId),
      parseInt(taskId),
    );
  }
}
