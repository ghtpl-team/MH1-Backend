import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { RewardPointsModule } from '../reward-points/reward-points.module';

@Module({
  imports: [RewardPointsModule],
  providers: [ActivitiesService, GraphQLClientService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
