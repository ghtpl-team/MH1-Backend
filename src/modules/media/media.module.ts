import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, GraphQLClientService],
})
export class MediaModule {}
