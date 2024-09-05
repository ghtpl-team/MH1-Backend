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
      return await this.em
        .getKnex()
        .select('*')
        .from('mh_users')
        .where({
          'mh_users.id': id,
        })
        .leftJoin('mh_user_preferences', function () {
          this.on('mh_user_preferences.user_id', '=', 'mh_users.id');
        });
      return this.em
        .createQueryBuilder(User, 'user')
        .select('*')
        .where({ id })
        .leftJoin('userPreferences', 'up', {});
    } catch (error) {
      throw error;
    }
  }
}
