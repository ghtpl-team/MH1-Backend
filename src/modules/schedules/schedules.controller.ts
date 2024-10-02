import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulingService: SchedulesService) {}

  @Put()
  @ApiQuery({
    name: 'scheduleId',
    required: false,
    type: String,
    description: 'Optional schedule ID to update existing schedules',
  })
  async createReminder(
    @Body() createReminderDto: ReminderCreateReqDto,
    @Query('userId') userId: string,
    @Query('scheduleId') scheduleId?: string,
  ) {
    if (!userId)
      throw new HttpException('user id is required', HttpStatus.BAD_REQUEST);
    if (scheduleId)
      return this.schedulingService.upsert(
        createReminderDto,
        parseInt(userId),
        parseInt(scheduleId),
      );
    else
      return this.schedulingService.create(createReminderDto, parseInt(userId));
  }

  @Get('trigger')
  async triggerTaskScheduler() {
    return this.schedulingService.scheduleDailyTasks();
  }
}
