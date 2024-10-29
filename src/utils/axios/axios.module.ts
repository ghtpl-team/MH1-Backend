import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  exports: [AxiosModule, AxiosService],
  providers: [AxiosService],
})
export class AxiosModule {}
