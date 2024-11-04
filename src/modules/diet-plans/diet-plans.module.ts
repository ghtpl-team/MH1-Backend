import { Module } from '@nestjs/common';
import { DietPlansController } from './diet-plans.controller';
import { DietPlansService } from './diet-plans.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';
import { MoEngageModule } from 'src/utils/moengage/moengage.module';

@Module({
  imports: [DayjsModule, MoEngageModule],
  controllers: [DietPlansController],
  providers: [DietPlansService, GraphQLClientService],
  exports: [DietPlansService],
})
export class DietPlansModule {}
