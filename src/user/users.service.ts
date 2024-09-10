import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ReminderType,
  Schedule,
  ScheduledBy,
  Status,
  User,
} from 'src/app.entities';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(
    userData: Partial<User>,
  ): Promise<Pick<User, 'id' | 'phone' | 'status'>> {
    const activityTasks = [
      ReminderType.WATER_REMINDER,
      ReminderType.DIET_REMINDER,
      ReminderType.SOUL_REMINDER,
      ReminderType.MIND_REMINDER,
      ReminderType.FITNESS_REMINDER,
    ];

    const user = this.em.create(User, userData);

    const schedules = activityTasks.map((task) => {
      return this.em.create(Schedule, {
        type: task,
        scheduledTasks: {
          type: task,
          user: user,
        },
        user: user,
      });
    });

    await this.em.persistAndFlush([user, ...schedules]);

    return { id: user.id, phone: user.phone, status: user.status };
  }

  async findAll(): Promise<User[]> {
    return await this.em.find(User, { status: Status.ACTIVE });
  }

  private parseUserData(userData: User[]) {
    return {
      id: userData[0].id,
      phone: userData[0].phone,
      isPreferencesLogged: userData[0].userPreferences?.afterLunch
        ? true
        : false,
      userSettings: userData[0].userPreferences
        ? {
            id: userData[0].userPreferences.id,
            isActivityLocked: userData[0].userPreferences.isActivityLocked,
            isJournalLocked: userData[0].userPreferences.isJournalLocked,
          }
        : null,
      schedules: userData[0].schedules.length
        ? userData[0].schedules.map((schedule) => {
            return {
              id: schedule.id,
              scheduledBy: schedule.scheduledBy,
              type: schedule.type,
              time: ScheduledBy.SYSTEM ? null : schedule.reminderTime,
            };
          })
        : [],
    };
  }

  async find(id: number) {
    try {
      const userData = await this.em
        .createQueryBuilder(User, 'u')
        .select(['u.id', 'u.phone'])
        .leftJoinAndSelect('u.userPreferences', 'up', {}, [
          'isActivityLocked',
          'isJournalLocked',
        ])
        .leftJoinAndSelect('schedules', 'sc', {}, [
          'id',
          'type',
          'reminderTime',
          'scheduledBy',
        ])
        .where({ id })
        .execute();
      if (userData && userData.length) {
        return this.parseUserData(userData);
      }
      throw new HttpException(
        'No user exists for given id',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      throw error;
    }
  }
}
