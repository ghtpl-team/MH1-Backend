import { PrimaryKey, Property, Enum, Index } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export class BaseClass {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Enum()
  @Index()
  status: Status = Status.ACTIVE;

  @Index()
  @Property({ type: 'uuid' })
  publicUuid: string = uuidv4();
}

export enum Status {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}
