import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { RewardPointsModule } from '../reward-points/reward-points.module';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';
import { DietPlansModule } from '../diet-plans/diet-plans.module';

@Module({
  imports: [RewardPointsModule, DayjsModule, DietPlansModule],
  providers: [ActivitiesService, GraphQLClientService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
