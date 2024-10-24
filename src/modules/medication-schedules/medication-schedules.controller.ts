import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MedicationSchedulesService } from './medication-schedules.service';
import {
  CreateMedicationScheduleDto,
  UpdateMedicationScheduleDto,
} from './dto/medication-schedules.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
@Controller('users/:userId/medication-schedule')
@ApiTags('Medication Scheduler')
@ApiBearerAuth()
export class MedicationSchedulesController {
  constructor(
    private readonly medicationScheduleService: MedicationSchedulesService,
  ) {}

  @Post('add')
  @UseGuards(CustomAuthGuard)
  async createMedicationEntry(
    @Body() createMedicationScheduleDto: CreateMedicationScheduleDto,
    @Req() req: Request,
    @Headers('x-mh-v3-user-id') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return await this.medicationScheduleService.create(
      createMedicationScheduleDto,
      userId,
    );
  }

  @Get()
  @UseGuards(CustomAuthGuard)
  async getMedicalSchedule(
    @Req() req: Request,
    @Headers('x-mh-v3-user-id') mhUserId: string,
  ) {
    const userId = parseInt(req.headers['x-mh-user-id']) || parseInt(mhUserId);
    return await this.medicationScheduleService.findAll(userId);
  }

  @Delete(':id')
  async deleteMedicationEntry(@Param('id') id: string) {
    const medicationScheduleId = parseInt(id);
    return this.medicationScheduleService.delete(medicationScheduleId);
  }

  @Patch(':id')
  async updateMedicationEntry(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateMedicationScheduleDto: UpdateMedicationScheduleDto,
  ) {
    const medicationScheduleId = parseInt(id);
    return this.medicationScheduleService.update(
      medicationScheduleId,
      updateMedicationScheduleDto,
    );
  }
}
