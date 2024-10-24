import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import {
  DailyActivityWatchHistoryDto,
  FeedbackFromDto,
} from './dto/activities.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ReminderType } from 'src/entities/schedules.entity';
import { ActivityType } from 'src/entities/activity-watch-history.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('activities')
@ApiTags('Activities')
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('mind')
  async mindActivities(@Query('week') weekNumber: string = '1') {
    return this.activitiesService.fetchMindActivities(parseInt(weekNumber));
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
    @Query('activityType') activityType: ReminderType = null,
  ) {
    if (!taskId || !userId)
      throw new HttpException('task id is required', HttpStatus.BAD_REQUEST);
    return this.activitiesService.updateActivityStatus(
      parseInt(userId),
      parseInt(taskId),
      activityType,
    );
  }

  @Put('watch-history')
  @UseGuards(CustomAuthGuard)
  async record(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('activityType') activityType: ActivityType,
    @Body() dailyActivityLedgerDto: DailyActivityWatchHistoryDto,
  ) {
    if (!userId || !activityType)
      throw new HttpException(
        'required params missing',
        HttpStatus.BAD_REQUEST,
      );

    return this.activitiesService.recordDailyProgress(
      parseInt(userId),
      activityType,
      dailyActivityLedgerDto,
    );
  }

  @Get('watch-history')
  @UseGuards(CustomAuthGuard)
  async records(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('activityType') activityType: ActivityType,
  ) {
    return this.activitiesService.fetchDailyActivityWatchHistory(
      parseInt(userId),
      activityType,
    );
  }
}
