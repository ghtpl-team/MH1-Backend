import { Module } from '@nestjs/common';
import { DietPlansController } from './diet-plans.controller';
import { DietPlansService } from './diet-plans.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [DietPlansController],
  providers: [DietPlansService, GraphQLClientService],
})
export class DietPlansModule {}
