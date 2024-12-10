import { Injectable } from '@nestjs/common';
import { IAPProviderFactory } from './factory/iap-provider.factory';
import { AppleIAPProvider } from './providers/apple-iap.provider';

@Injectable()
export class IAPService {
  constructor(private readonly iapProviderFactory: IAPProviderFactory) {}

  async verifyAndDecodeNotification(platform: 'ios' | 'android', payload: any) {
    const provider = this.iapProviderFactory.getProvider(
      platform,
    ) as unknown as AppleIAPProvider;
    return provider.verifyAndDecodeNotification(payload?.signedPayload);
  }

  async handleSubscriptionNotification(
    platform: 'ios' | 'android',
    payload: any,
  ) {
    const provider = this.iapProviderFactory.getProvider(
      platform,
    ) as unknown as AppleIAPProvider;
    return provider.handleNotification(payload);
  }
}
