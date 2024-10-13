import { Module } from '@nestjs/common';
import { RewardPointsService } from './reward-points.service';

@Module({
  exports: [RewardPointsService],
  providers: [RewardPointsService],
})
export class RewardPointsModule {}
