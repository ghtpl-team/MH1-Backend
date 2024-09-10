import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import { Schedule, ScheduledBy } from 'src/app.entities';

@Injectable()
export class SchedulesService {
  constructor(private readonly em: EntityManager) {}

  async upsert(
    reminderCreateDto: ReminderCreateReqDto,
    userId: number,
    scheduleId: number,
  ) {
    try {
      const schedule = this.em.nativeUpdate(
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

      await this.em.flush();
      return schedule;
    } catch (error) {
      throw error;
    }
  }
}
