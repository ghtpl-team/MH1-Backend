import { Module } from '@nestjs/common';
import { UnsubscribedHomeController } from './unsubscribed-home.controller';
import { UnsubscribedHomeService } from './unsubscribed-home.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [UnsubscribedHomeController],
  providers: [UnsubscribedHomeService, GraphQLClientService],
})
export class UnsubscribedHomeModule {}
