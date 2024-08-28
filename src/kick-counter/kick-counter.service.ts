import { EntityManager, Loaded } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import {
  CreateKickSessionDto,
  UpdateKickSessionDto,
} from './dto/kick-counter.dto';
import { KickCounter, Status } from 'src/app.entities';
import { KickHistoryResponseObj } from './kick-counter.interface';
import { formatDurationInMinutes } from 'src/common/utils/date-time.utils';

@Injectable()
export class KickCounterService {
  constructor(private readonly em: EntityManager) {}

  async create(createKickSessionDto: CreateKickSessionDto, userId: number) {
    try {
      const kickSession = this.em.create(KickCounter, {
        ...createKickSessionDto,
        user: userId,
      });
      this.em.flush();
      return kickSession;
    } catch (error) {
      throw error;
    }
  }

  async update(updateKickSessionDto: UpdateKickSessionDto, id: number) {
    try {
      const updatedKickSession = this.em
        .createQueryBuilder(KickCounter)
        .update({
          startTime: updateKickSessionDto.startTime,
        })
        .where({
          id,
        });
      return updatedKickSession;
    } catch (error) {
      throw error;
    }
  }

  async deleteByDate(date: string, userId: number) {
    try {
      const deletedKickSessions = this.em.nativeUpdate(
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
      return deletedKickSessions;
    } catch (error) {
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
      throw error;
    }
  }

  private groupKickSessionsByDate(
    kickSessionHistory: Loaded<KickCounter, never>[],
  ) {
    return kickSessionHistory.reduce((ksHistory, kickSession) => {
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

      return Object.values(ksHistory);
    }, {} as KickHistoryResponseObj[]);
  }

  async fetchAllByDate(
    dateRange: 'last_7_days' | 'last_30_days' | 'last_60_days',
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
        })
        .orderBy({ date: 'DESC' });

      return this.groupKickSessionsByDate(kickSessionHistory);
    } catch (error) {
      throw error;
    }
  }
}
