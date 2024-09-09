import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import { Schedule } from 'src/app.entities';

@Injectable()
export class SchedulesService {
  constructor(private readonly em: EntityManager) {}

  async create(reminderCreateDto: ReminderCreateReqDto, userId: number) {
    try {
      const reminder = this.em.create(Schedule, {
        user: userId,
        ...reminderCreateDto,
        scheduledTasks: {
          type: reminderCreateDto.type,
        },
      });

      await this.em.flush();
      return reminder;
    } catch (error) {
      throw error;
    }
  }
}
