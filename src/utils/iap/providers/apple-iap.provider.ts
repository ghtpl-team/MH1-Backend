import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppStoreServerAPIClient,
  Environment,
  ResponseBodyV2DecodedPayload,
  SignedDataVerifier,
} from '@apple/app-store-server-library';
import { readFileSync } from 'fs';
import { loadRootCAs } from 'src/common/utils/helper.utils';
import { VerifyPurchaseDto } from '../dto/verify-purchase.dto';
import {
  AppleSubscriptionStatus,
  Subscriptions,
  SubscriptionStatus,
} from 'src/entities/subscriptions.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { WebhookEvents } from 'src/entities/webhook-events.entity';

@Injectable()
export class AppleIAPProvider {
  private readonly logger = new Logger(AppleIAPProvider.name);
  private readonly signedDataVerifier: SignedDataVerifier;

  private readonly issuerId = this.configService.get<string>(
    'APP_STORE_ISSUER_ID',
  );
  private readonly keyId = this.configService.get<string>('APP_STORE_KEY_ID');
  private readonly bundleId = this.configService.get<string>(
    'APP_STORE_BUNDLE_ID',
  );
  private readonly rootCertificates = loadRootCAs();
  private readonly encodedKeyPath = this.configService.get<string>(
    'APP_STORE_PRIVATE_KEY',
  );
  private readonly encodedKey = readFileSync(this.encodedKeyPath, 'utf8');
  private readonly environment = Environment.SANDBOX;
  private readonly apiClient: AppStoreServerAPIClient;

  constructor(
    private configService: ConfigService,
    private readonly em: EntityManager,
  ) {
    this.apiClient = new AppStoreServerAPIClient(
      this.encodedKey,
      this.keyId,
      this.issuerId,
      this.bundleId,
      this.environment,
    );

    this.signedDataVerifier = new SignedDataVerifier(
      this.rootCertificates,
      false,
      this.environment,
      this.bundleId,
    );
  }

  private mapAppleToRazorpayStatus(
    appleStatus: AppleSubscriptionStatus,
  ): SubscriptionStatus {
    this.logger.debug(`Mapping Apple status: ${appleStatus}`);

    switch (appleStatus) {
      case AppleSubscriptionStatus.ACTIVE:
        return SubscriptionStatus.ACTIVE;

      case AppleSubscriptionStatus.EXPIRED:
        return SubscriptionStatus.EXPIRED;

      case AppleSubscriptionStatus.IN_BILLING_RETRY:
        return SubscriptionStatus.HALTED;

      case AppleSubscriptionStatus.GRACE_PERIOD:
        return SubscriptionStatus.PENDING;

      case AppleSubscriptionStatus.REVOKED:
        return SubscriptionStatus.CANCELLED;

      default:
        this.logger.warn(`Unknown Apple status: ${appleStatus}`);
        return SubscriptionStatus.EXPIRED;
    }
  }

  async verifyPurchase(
    data: VerifyPurchaseDto,
    userId: number,
  ): Promise<Record<string, any>> {
    try {
      const transactionInfo = await this.apiClient.getTransactionInfo(
        data.transactionId,
      );

      if (!transactionInfo.signedTransactionInfo) {
        throw new Error('No signed transaction info available');
      }

      const decodedTransactionInfo =
        await this.signedDataVerifier.verifyAndDecodeTransaction(
          transactionInfo.signedTransactionInfo,
        );

      if (decodedTransactionInfo.transactionId !== data.transactionId) {
        throw new Error('Transaction ID mismatch');
      }

      const subscription = this.em.create(Subscriptions, {
        user: userId,
        apiResponse: decodedTransactionInfo,
        expiryDate:
          decodedTransactionInfo?.expiresDate?.toString() ?? undefined,
        razorPaySubscriptionId: decodedTransactionInfo.webOrderLineItemId,
        plan: 1,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionUrl: '',
        totalBillingCycle: data.totalBillingCycle,
        remainingCount: data.totalBillingCycle - 1,
      });

      await this.em.persistAndFlush([subscription]);

      return {
        status: SubscriptionStatus.ACTIVE,
        expirationDate: decodedTransactionInfo.expiresDate,
        productId: decodedTransactionInfo.productId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to verify purchase: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendTestNotification() {
    try {
      const { testNotificationToken } =
        await this.apiClient.requestTestNotification();
      return {
        success: true,
        notificationToken: testNotificationToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyAndDecodeNotification(
    signedPayload: string,
  ): Promise<ResponseBodyV2DecodedPayload> {
    try {
      const webhookPayload =
        await this.signedDataVerifier.verifyAndDecodeNotification(
          signedPayload,
        );

      return webhookPayload;
    } catch (error) {
      this.logger.error(
        `Failed to handle server notification: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async handleNotification(notification: ResponseBodyV2DecodedPayload) {
    try {
      switch (notification.notificationType) {
        case 'SUBSCRIBED':
          await this.handleNewSubscription(notification);
          break;
        case 'DID_RENEW':
          await this.handleRenewal(notification);
          break;
        case 'DID_CHANGE_RENEWAL_STATUS':
          await this.handleRenewal(notification);
          break;
        case 'DID_FAIL_TO_RENEW':
          await this.handleFailedRenewal(notification);
          break;
        case 'EXPIRED':
          await this.handleExpiration(notification);
          break;
        default:
          this.logger.warn(
            `Unhandled notification type: ${notification.notificationType}`,
          );
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle notification: ${error.message}`,
        error.stack,
      );
    }
  }

  private async handleNewSubscription(
    notification: ResponseBodyV2DecodedPayload,
  ): Promise<void> {
    try {
      const subscriptionData = notification?.data;
      const transactionInfo =
        await this.signedDataVerifier.verifyAndDecodeTransaction(
          subscriptionData?.signedTransactionInfo,
        );

      const renewableInfo =
        await this.signedDataVerifier.verifyAndDecodeRenewalInfo(
          subscriptionData?.signedRenewalInfo,
        );

      const events = [
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: transactionInfo,
          eventId: notification.notificationUUID,
        }),
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: renewableInfo,
          eventId: notification.notificationUUID,
        }),
      ];
      await this.em.persistAndFlush(events);
      return;
    } catch (error) {
      this.logger.error('Error handling new subscription', error.stack);
    }
  }

  private async handleRenewal(
    notification: ResponseBodyV2DecodedPayload,
  ): Promise<void> {
    try {
      const subscriptionData = notification?.data;
      const transactionInfo =
        await this.signedDataVerifier.verifyAndDecodeTransaction(
          subscriptionData?.signedTransactionInfo,
        );

      const renewableInfo =
        await this.signedDataVerifier.verifyAndDecodeRenewalInfo(
          subscriptionData?.signedRenewalInfo,
        );

      const events = [
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: transactionInfo,
          eventId: notification.notificationUUID,
        }),
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: renewableInfo,
          eventId: notification.notificationUUID,
        }),
      ];
      await this.em.persistAndFlush(events);
      return;
    } catch (error) {
      this.logger.error('Error handling renewal', error.stack);
    }
  }

  private async handleFailedRenewal(
    notification: ResponseBodyV2DecodedPayload,
  ): Promise<void> {
    try {
      const subscriptionData = notification?.data;
      const transactionInfo =
        await this.signedDataVerifier.verifyAndDecodeTransaction(
          subscriptionData?.signedTransactionInfo,
        );

      const renewableInfo =
        await this.signedDataVerifier.verifyAndDecodeRenewalInfo(
          subscriptionData?.signedRenewalInfo,
        );

      const events = [
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: transactionInfo,
          eventId: notification.notificationUUID,
        }),
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: renewableInfo,
          eventId: notification.notificationUUID,
        }),
      ];
      await this.em.persistAndFlush(events);
      return;
    } catch (error) {
      this.logger.error('Error handling failed renewal', error.stack);
    }
  }

  private async handleExpiration(
    notification: ResponseBodyV2DecodedPayload,
  ): Promise<void> {
    try {
      const subscriptionData = notification?.data;
      const transactionInfo =
        await this.signedDataVerifier.verifyAndDecodeTransaction(
          subscriptionData?.signedTransactionInfo,
        );

      const renewableInfo =
        await this.signedDataVerifier.verifyAndDecodeRenewalInfo(
          subscriptionData?.signedRenewalInfo,
        );

      const events = [
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: transactionInfo,
          eventId: notification.notificationUUID,
        }),
        this.em.create(WebhookEvents, {
          event: notification.notificationType,
          payload: renewableInfo,
          eventId: notification.notificationUUID,
        }),
      ];
      await this.em.persistAndFlush(events);
      return;
    } catch (error) {
      this.logger.error('Error handling expiration', error.stack);
    }
  }
}
