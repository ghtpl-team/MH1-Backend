import { Module } from '@nestjs/common';
import { KickCounterController } from './kick-counter.controller';
import { KickCounterService } from './kick-counter.service';

@Module({
  controllers: [KickCounterController],
  providers: [KickCounterService]
})
export class KickCounterModule {}
