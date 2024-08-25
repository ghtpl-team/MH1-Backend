import { EntityManager,EntitySchema } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from 'src/app.entities';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.em.create(User, userData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.em.find(User, {});
  }
}
