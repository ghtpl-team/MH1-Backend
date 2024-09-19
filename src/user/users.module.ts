import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, GraphQLClientService],
})
export class UsersModule {}
