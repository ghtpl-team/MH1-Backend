import { PrimaryKey, Property, Enum, Index } from '@mikro-orm/core';

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
}

export enum Status {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}
