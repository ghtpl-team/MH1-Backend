import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import {
  Frequency,
  ReminderType,
  Schedule,
  ScheduledBy,
  Status,
} from 'src/app.entities';

@Injectable()
export class SchedulesService {
  constructor(private readonly em: EntityManager) {}

  async upsert(
    reminderCreateDto: ReminderCreateReqDto,
    userId: number,
    scheduleId: number,
  ) {
    try {
      const schedule = await this.em.nativeUpdate(
        Schedule,
        { id: scheduleId },
        {
          user: userId,
          reminderTime: reminderCreateDto.reminderTime,
          scheduledBy: reminderCreateDto.isActive
            ? ScheduledBy.USER
            : ScheduledBy.SYSTEM,
        },
      );
      return `${schedule} schedule updated successfully`;
    } catch (error) {
      throw error;
    }
  }

  async create(reminderCreateDto: ReminderCreateReqDto, userId: number) {
    try {
      if (!reminderCreateDto?.selectedDays)
        throw new HttpException(
          'Please select days for reminder',
          HttpStatus.BAD_REQUEST,
        );
      const schedule = this.em.create(Schedule, {
        user: userId,
        reminderTime: reminderCreateDto.reminderTime,
        scheduledBy: ScheduledBy.USER,
        status: reminderCreateDto.isActive ? Status.ACTIVE : Status.DELETED,
        type: ReminderType.MEDICATION_SCHEDULE,
        recurrenceRule: Frequency.SPECIFIC_DAYS,
        selectedDays: reminderCreateDto.selectedDays,
      });
      await this.em.flush();

      return `Schedule with id ${schedule.id} is created.`;
    } catch (error) {
      throw error;
    }
  }
}
