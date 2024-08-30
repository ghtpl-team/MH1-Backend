import { Module } from '@nestjs/common';
import { MedicationSchedulesController } from './medication-schedules.controller';
import { MedicationSchedulesService } from './medication-schedules.service';
import { MedicationSchedule } from 'src/app.entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([MedicationSchedule])],
  controllers: [MedicationSchedulesController],
  providers: [MedicationSchedulesService],
})
export class MedicationSchedulesModule {}
