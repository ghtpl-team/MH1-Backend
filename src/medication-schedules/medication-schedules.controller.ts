import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { MedicationSchedulesService } from './medication-schedules.service';
import { CreateMedicationScheduleDto } from './dto/medication-schedules.dto';
import { MedicationSchedule } from 'src/app.entities';

@Controller('users/:userId/medication-schedule')
export class MedicationSchedulesController {
  constructor(
    private readonly medicationScheduleService: MedicationSchedulesService,
  ) {}

  @Post('add')
  async createMedicationEntry(
    @Body() createMedicationScheduleDto: CreateMedicationScheduleDto,
    @Req() req: Request,
    @Param('userId') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return await this.medicationScheduleService.create(
      createMedicationScheduleDto,
      userId,
    );
  }

  @Get()
  async getMedicalSchedule(
    @Req() req: Request,
    @Param('userId') mhUserId: string,
  ) {
    const userId = parseInt(req.headers['x-mh-user-id']) || parseInt(mhUserId);
    return await this.medicationScheduleService.findAll(userId);
  }

  @Patch(':id')
  async deleteMedicationEntry(
    @Req() req: Request,
    @Param('id') id: string,
  ){
    const medicationScheduleId = parseInt(id);
    return this.medicationScheduleService.delete(medicationScheduleId)
  }
}
