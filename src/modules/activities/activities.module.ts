import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { RewardPointsModule } from '../reward-points/reward-points.module';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [RewardPointsModule, DayjsModule],
  providers: [ActivitiesService, GraphQLClientService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
