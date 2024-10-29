import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AxiosModule } from 'src/utils/axios/axios.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [AxiosModule],
})
export class PostsModule {}
