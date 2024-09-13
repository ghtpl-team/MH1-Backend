import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RazorpayService, ConfigService],
})
export class RazorpayModule {}
