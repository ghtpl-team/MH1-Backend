import { Module } from '@nestjs/common';
import { MedicationSchedulesController } from './medication-schedules.controller';
import { MedicationSchedulesService } from './medication-schedules.service';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MedicationSchedule } from 'src/entities/medication-schedule.entity';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [MikroOrmModule.forFeature([MedicationSchedule]), DayjsModule],
  controllers: [MedicationSchedulesController],
  providers: [MedicationSchedulesService],
})
export class MedicationSchedulesModule {}
