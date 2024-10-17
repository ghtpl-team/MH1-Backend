import { Module } from '@nestjs/common';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [DayjsModule],
  controllers: [JournalsController],
  providers: [JournalsService],
})
export class JournalsModule {}
