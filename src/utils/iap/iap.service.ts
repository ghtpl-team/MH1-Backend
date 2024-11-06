import { Injectable } from '@nestjs/common';
import { IAPProviderFactory } from './factory/iap-provider.factory';
import { AppleIAPProvider } from './providers/apple-iap.provider';

@Injectable()
export class IAPService {
  constructor(private readonly iapProviderFactory: IAPProviderFactory) {}

  async handleWebhook(
    platform: 'ios' | 'android',
    payload: any,
  ): Promise<void> {
    const provider = this.iapProviderFactory.getProvider(
      platform,
    ) as unknown as AppleIAPProvider;
    await provider.handleServerNotification(payload);
  }
}
