import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';

@Module({
  providers: [SchedulesService, DayjsService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
