import { Module } from '@nestjs/common';
import { TimezoneService } from './timezone.service';
import { RequestContextModule } from '../request-context/request-context.module';

@Module({
  imports: [RequestContextModule],
  providers: [TimezoneService],
  exports: [TimezoneService],
})
export class TimezoneModule {}
