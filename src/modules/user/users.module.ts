import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { User } from 'src/entities/user.entity';
import { DayjsModule } from 'src/utils/dayjs/dayjs.module';

@Module({
  imports: [MikroOrmModule.forFeature([User]), DayjsModule],
  controllers: [UserController],
  providers: [UsersService, GraphQLClientService],
})
export class UsersModule {}
