import { Module } from '@nestjs/common';
import { MoEngageService } from './moengage.service';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from '../axios/axios.module';

@Module({
  providers: [MoEngageService],
  exports: [MoEngageService],
  imports: [ConfigModule, AxiosModule],
})
export class MoEngageModule {}
