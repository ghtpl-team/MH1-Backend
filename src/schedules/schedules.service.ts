import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import {
  Frequency,
  ReminderType,
  Schedule,
  ScheduledBy,
  ScheduledTask,
  ScheduledTaskStatus,
  Status,
} from 'src/app.entities';
import { Cron } from '@nestjs/schedule';

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
        type: ReminderType.JOURNAL_SCHEDULE,
        recurrenceRule: Frequency.SPECIFIC_DAYS,
        selectedDays: reminderCreateDto.selectedDays,
      });
      await this.em.flush();

      return `Schedule with id ${schedule.id} is created.`;
    } catch (error) {
      throw error;
    }
  }

  @Cron('0 14 */1 * *', { timeZone: 'Asia/Kolkata' })
  async scheduleDailyTasks() {
    let hasNextPage = true;
    let endCursor = null;
    const fork = this.em.fork();
    while (hasNextPage) {
      const schedules = await fork.findByCursor(
        Schedule,
        {
          status: Status.ACTIVE,
        },
        {
          first: 50,
          after: {
            endCursor,
          },
          orderBy: {
            reminderTime: QueryOrder.ASC,
          },
        },
      );
      const tasks = [];
      for (const schedule of schedules.items) {
        const task = fork.create(ScheduledTask, {
          schedule: schedule,
          taskStatus: ScheduledTaskStatus.PENDING,
          type: schedule.type,
          user: schedule.user,
        });
        tasks.push(task);
      }
      await fork.persistAndFlush([...tasks]);
      hasNextPage = schedules.hasNextPage;
      endCursor = schedules.endCursor;
    }
  }
}
