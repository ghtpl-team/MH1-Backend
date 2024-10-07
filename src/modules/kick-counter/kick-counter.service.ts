import { EntityManager, Loaded } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateKickSessionDto,
  UpdateKickSessionDto,
} from './dto/kick-counter.dto';

import { KickHistoryResponseObj } from './kick-counter.interface';
import {
  formatDurationInMinutes,
  timeDifferenceInSeconds,
} from 'src/common/utils/date-time.utils';
import { Status } from 'src/entities/base.entity';
import { KickCounter } from 'src/entities/kick-counter.entity';

@Injectable()
export class KickCounterService {
  private readonly logger = new Logger(KickCounterService.name);
  constructor(private readonly em: EntityManager) {}

  async create(createKickSessionDto: CreateKickSessionDto, userId: number) {
    try {
      const kickSession = this.em.create(KickCounter, {
        ...createKickSessionDto,
        user: userId,
      });
      await this.em.flush();
      return `Kick session recorded successfully. session id: ${kickSession.id}`;
    } catch (error) {
      this.logger.error(
        'Error while creating kick session',
        error.stack || error,
      );
      throw error;
    }
  }

  async update(updateKickSessionDto: UpdateKickSessionDto, id: number) {
    try {
      const currentKickSession = await this.em.findOne(
        KickCounter,
        {
          id,
        },
        {
          populate: ['startTime', 'durationInSec'],
        },
      );

      const timeDifference = timeDifferenceInSeconds(
        updateKickSessionDto.startTime,
        currentKickSession.startTime,
      );

      const updatedKickSession = this.em
        .createQueryBuilder(KickCounter)
        .update({
          startTime: updateKickSessionDto.startTime,
          durationInSec: currentKickSession.durationInSec + timeDifference,
        })
        .where({
          id,
        });
      return updatedKickSession;
    } catch (error) {
      this.logger.error(
        'Error while updating kick session',
        error.stack || error,
      );
      throw error;
    }
  }

  async deleteByDate(date: string, userId: number) {
    try {
      const deletedKickSessions = await this.em.nativeUpdate(
        KickCounter,
        {
          date,
          user: {
            id: userId,
          },
        },
        {
          status: Status.DELETED,
        },
      );

      if (deletedKickSessions === 0)
        throw new HttpException('Nothing to deleted', HttpStatus.BAD_REQUEST);
      return `${deletedKickSessions} session deleted successfully`;
    } catch (error) {
      this.logger.error(
        'Error while deleting kick session',
        error.stack || error,
      );
      throw error;
    }
  }

  private getStartDateFromFilters(
    dateRange: 'last_7_days' | 'last_30_days' | 'last_60_days',
  ) {
    try {
      const currentDate = new Date();
      switch (dateRange) {
        case 'last_7_days':
          return new Date(currentDate.setDate(currentDate.getDate() - 7));
          break;
        case 'last_30_days':
          return new Date(currentDate.setDate(currentDate.getDate() - 30));
          break;
        case 'last_60_days':
          return new Date(currentDate.setDate(currentDate.getDate() - 60));
          break;
        default:
          throw new Error('Invalid date range');
      }
    } catch (error) {
      this.logger.error(
        'Error while getting start date from filters',
        error.stack || error,
      );
      throw error;
    }
  }

  private calculateEndTime(startTime: string, durationInSec: number) {
    try {
      const [hours, minutes, seconds] = startTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds);

      date.setSeconds(date.getSeconds() + durationInSec);
      return date.toTimeString().split(' ')[0];
    } catch (error) {
      this.logger.error(
        'Error while calculating end time',
        error.stack || error,
      );
      throw error;
    }
  }

  private groupKickSessionsByDate(
    kickSessionHistory: Loaded<KickCounter, never>[],
  ) {
    try {
      const groupedHistory = kickSessionHistory.reduce(
        (ksHistory, kickSession) => {
          const date = kickSession.date;

          if (!ksHistory[date]) {
            ksHistory[date] = {
              date: date,
              sessions: [],
            };
          }

          ksHistory[date].sessions.push({
            id: kickSession.id,
            startTime: kickSession.startTime,
            endTime: this.calculateEndTime(
              kickSession.startTime,
              kickSession.durationInSec,
            ),
            duration: formatDurationInMinutes(kickSession.durationInSec),
            kickCount: kickSession.kickCount,
          });
          return ksHistory;
        },
        {} as KickHistoryResponseObj[],
      );
      return Object.values(groupedHistory);
    } catch (error) {
      this.logger.error(
        'Error while grouping kick sessions by date',
        error.stack || error,
        ``,
      );
      throw error;
    }
  }

  async fetchAllByDate(
    dateRange: 'last_7_days' | 'last_30_days' | 'last_60_days',
    userId: number,
  ) {
    try {
      const startDate: Date = this.getStartDateFromFilters(dateRange);

      const kickSessionHistory = await this.em
        .createQueryBuilder(KickCounter)
        .select(['date', 'id', 'startTime', 'durationInSec', 'kickCount'])
        .where({
          status: Status.ACTIVE,
          date: {
            $gte: startDate,
          },
          user: userId,
        })
        .orderBy({ date: 'DESC' });

      return this.groupKickSessionsByDate(kickSessionHistory);
    } catch (error) {
      this.logger.error(
        'Error while fetching kick session history',
        error.stack || error,
      );
      throw error;
    }
  }
}
