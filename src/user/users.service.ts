import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Status, User } from 'src/app.entities';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.em.create(User, userData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.em.find(User, { status: Status.ACTIVE });
  }

  private parseUserData(userData: User[]) {
    return {
      id: userData[0].id,
      phone: userData[0].phone,
      userPreferences: userData[0].userPreferences
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
              reminderTime: schedule.reminderTime,
              type: schedule.type,
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
