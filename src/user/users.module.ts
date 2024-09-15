import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/app.entities';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, GraphQLClientService],
})
export class UsersModule {}
