import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
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
      return userData;
    } catch (error) {
      throw error;
    }
  }
}
