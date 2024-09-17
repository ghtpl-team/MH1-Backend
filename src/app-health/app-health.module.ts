import { Module } from '@nestjs/common';
import { AppHealthController } from './app-health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [AppHealthController],
})
export class AppHealthModule {}
