import { Module } from '@nestjs/common';
import { IAPService } from './iap.service';
import { IAPProviderFactory } from './factory/iap-provider.factory';
import { AppleIAPProvider } from './providers/apple-iap.provider';
import { GoogleIAPProvider } from './providers/google-iap.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    IAPService,
    IAPProviderFactory,
    AppleIAPProvider,
    GoogleIAPProvider,
    ConfigService,
  ],
  exports: [IAPService],
})
export class IapModule {}
