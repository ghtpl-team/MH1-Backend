import { Body, Controller, Put, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ReminderCreateReqDto } from './dto/schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulingService: SchedulesService) {}

  @Put()
  async createReminder(
    @Body() createReminderDto: ReminderCreateReqDto,
    @Query('userId') userId: string,
    @Query('scheduleId') scheduleId: string,
  ) {
    return this.schedulingService.upsert(
      createReminderDto,
      parseInt(userId),
      parseInt(scheduleId),
    );
  }
}
