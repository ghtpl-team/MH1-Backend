import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  ReminderType,
  Schedule,
  ScheduledBy,
  Status,
  Subscriptions,
  SubscriptionStatus,
  User,
} from 'src/app.entities';
@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

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

  private parseUserData(userData: User[], subscriptionStatus: string) {
    return {
      id: userData[0].id,
      phone: userData[0].phone,
      isPreferencesLogged: userData[0].userPreferences?.afterLunch
        ? true
        : false,
      isSubscribed:
        subscriptionStatus === SubscriptionStatus.ACTIVE ? true : false,
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
              time:
                schedule.scheduledBy === ScheduledBy.SYSTEM
                  ? null
                  : schedule.reminderTime,
            };
          })
        : [],
    };
  }

  private async userSubscriptionStatus(userId: number) {
    try {
      const subscriptionInfo = await this.em.findOne(
        Subscriptions,
        {
          user: userId,
        },
        {
          populate: ['id', 'subscriptionStatus'],
          orderBy: {
            updatedAt: QueryOrder.DESC,
            createdAt: QueryOrder.DESC,
          },
        },
      );
      if (!subscriptionInfo) {
        await this.cacheService.set(userId.toString(), 'missing');
        return 'missing';
      }

      await this.cacheService.set(
        userId.toString(),
        subscriptionInfo.subscriptionStatus,
      );
      return subscriptionInfo.subscriptionStatus;
    } catch (error) {
      throw error;
    }
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
        let subscriptionStatus = await this.cacheService.get(id.toString());
        if (!subscriptionStatus) {
          subscriptionStatus = await this.userSubscriptionStatus(id);
        }
        return this.parseUserData(userData, subscriptionStatus as string);
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
