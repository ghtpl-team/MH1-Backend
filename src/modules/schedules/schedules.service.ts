import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ReminderCreateReqDto } from './dto/schedules.dto';
import { Cron } from '@nestjs/schedule';
import { Status } from 'src/entities/base.entity';
import { Frequency } from 'src/entities/medication-schedule.entity';
import {
  ScheduledTask,
  ScheduledTaskStatus,
} from 'src/entities/scheduled-tasks.entity';
import {
  Schedule,
  ScheduledBy,
  ReminderType,
} from 'src/entities/schedules.entity';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';
import { CronJobStatus, CronStatus } from 'src/entities/cron-status.entity';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly dayJsService: DayjsService,
  ) {}

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
      this.logger.error(
        'Error while updating schedule. Please try again later.',
        error.stack || error,
      );
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
      this.logger.error(
        'Error while creating schedule. Please try again later.',
        error.stack || error,
      );
      throw error;
    }
  }

  private needToSchedule(schedule: Schedule): boolean {
    try {
      const currentDay = this.dayJsService.getCurrentDay().toLowerCase();

      const selectedDays = schedule?.selectedDays?.map((day) =>
        day.toLowerCase(),
      );

      if (
        schedule?.selectedDays &&
        schedule?.selectedDays.length &&
        selectedDays &&
        selectedDays.length &&
        !selectedDays.includes(currentDay)
      )
        return false;
      return true;
    } catch (error) {
      this.logger.error(
        'Error while checking if need to schedule. Please try again later.',
        error.stack || error,
      );
      throw error;
    }
  }

  @Cron('0 0 */1 * *', { timeZone: 'Asia/Kolkata' })
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
      const successSchedules = [];
      const failedSchedules = [];
      const skippedSchedules = [];
      try {
        for (const schedule of schedules.items) {
          if (this.needToSchedule(schedule)) {
            const task = fork.create(ScheduledTask, {
              schedule: schedule,
              taskStatus: ScheduledTaskStatus.PENDING,
              type: schedule.type,
              user: schedule.user,
            });
            tasks.push(task);

            const successStatus = new CronStatus();
            const failedStatus = new CronStatus();

            successStatus.schedule = schedule;
            successStatus.cronStatus = CronJobStatus.SUCCESS;

            failedStatus.schedule = schedule;
            failedStatus.cronStatus = CronJobStatus.FAILURE;

            successSchedules.push(successStatus);
            failedSchedules.push(failedStatus);
          } else {
            const skippedStatus = new CronStatus();

            skippedStatus.schedule = schedule;
            skippedStatus.cronStatus = CronJobStatus.SKIPPED;
            skippedSchedules.push(skippedStatus);
          }
        }
        await fork.persistAndFlush([...tasks]);
        this.logger.debug(
          `Scheduled ${tasks.length} tasks for ${schedules.items.length} schedules`,
        );
        await fork.insertMany(CronStatus, [
          ...successSchedules,
          ...skippedSchedules,
        ]);
      } catch (error) {
        await fork.insertMany(CronStatus, [
          ...failedSchedules,
          ...skippedSchedules,
        ]);
        this.logger.error(
          'Error while scheduling tasks. Please try again later.',
          error.stack || error,
        );
      }

      hasNextPage = schedules.hasNextPage;
      endCursor = schedules.endCursor;
    }
  }
}
