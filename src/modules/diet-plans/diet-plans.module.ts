import { Module } from '@nestjs/common';
import { DietPlansController } from './diet-plans.controller';
import { DietPlansService } from './diet-plans.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [DayjsModule],
  controllers: [DietPlansController],
  providers: [DietPlansService, GraphQLClientService],
})
export class DietPlansModule {}
