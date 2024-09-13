import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, GraphQLClientService],
})
export class ArticlesModule {}
