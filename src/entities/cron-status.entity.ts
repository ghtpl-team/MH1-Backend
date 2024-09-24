import { Entity, ManyToOne, Index, Property, Enum } from '@mikro-orm/core';
import { BaseClass } from './base.entity';
import { Schedule } from './schedules.entity';

@Entity({ tableName: 'mh_cron_job_status' })
export class CronStatus extends BaseClass {
  @ManyToOne(() => Schedule)
  schedule!: Schedule;

  @Index()
  @Property({ type: 'date' })
  date: string = new Date().toISOString().slice(0, 10);

  @Enum({ items: () => CronJobStatus, nativeEnumName: 'cron_job_status' })
  cronStatus: CronJobStatus = CronJobStatus.SUCCESS;

  @Property({ type: 'text', nullable: true })
  errorMessage?: string;
}

export enum CronJobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  SKIPPED = 'skipped',
}
