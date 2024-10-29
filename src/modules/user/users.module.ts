import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { User } from 'src/entities/user.entity';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import { MoEngageModule } from 'src/utils/moengage/moengage.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    DayjsModule,
    SubscriptionModule,
    MoEngageModule,
  ],
  controllers: [UserController],
  providers: [UsersService, GraphQLClientService],
  exports: [UsersService],
})
export class UsersModule {}
