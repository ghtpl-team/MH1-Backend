import { Module } from '@nestjs/common';
import { DayjsService } from './dayjs.service';

@Module({
  providers: [DayjsService],
})
export class DayjsModule {}
