import { Module } from '@nestjs/common';
import { DayjsService } from './dayjs.service';
import { TimezoneModule } from 'src/common/timezone/timezone.module';

@Module({
  imports: [TimezoneModule],
  providers: [DayjsService],
  exports: [DayjsService],
})
export class DayjsModule {}
