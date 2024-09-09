import { Body, Controller, Post, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ReminderCreateReqDto } from './dto/schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulingService: SchedulesService) {}

  @Post()
  async createReminder(
    @Body() createReminderDto: ReminderCreateReqDto,
    @Query('userId') userId: string,
  ) {
    return this.schedulingService.create(createReminderDto, parseInt(userId));
  }
}
