import { Injectable } from '@nestjs/common';
import { AppleIAPProvider } from '../providers/apple-iap.provider';
import { GoogleIAPProvider } from '../providers/google-iap.provider';

@Injectable()
export class IAPProviderFactory {
  constructor(
    private readonly appleProvider: AppleIAPProvider,
    private readonly googleProvider: GoogleIAPProvider,
  ) {}

  getProvider(platform: 'ios' | 'android') {
    switch (platform) {
      case 'ios':
        return this.appleProvider;
      case 'android':
        return this.googleProvider;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
