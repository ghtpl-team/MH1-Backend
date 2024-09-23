import { Module } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { SubscriptionPageController } from './subscription-page.controller';
import { SubscriptionPageService } from './subscription-page.service';

@Module({
  controllers: [SubscriptionPageController],
  providers: [SubscriptionPageService, GraphQLClientService],
})
export class SubscriptionPageModule {}
