import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  providers: [ActivitiesService, GraphQLClientService],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
