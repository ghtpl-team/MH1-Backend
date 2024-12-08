import { Injectable, Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  MoEngageConfig,
  MoEngageEvent,
  MoEngageUser,
} from './moengage.interface';
import { AxiosService } from '../axios/axios.service';

@Injectable()
export class MoEngageService {
  private readonly logger = new Logger(MoEngageService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private readonly config: MoEngageConfig;

  constructor(
    private configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.config = {
      dataCenter: this.configService.get<string>(
        'MOENGAGE_DATA_CENTER',
        'datacenter1',
      ),
      appId: this.configService.get<string>('MOENGAGE_APP_ID'),
      apiKey: this.configService.get<string>('MOENGAGE_API_KEY'),
    };

    this.baseUrl = `https://api.moengage.com/v1`;
  }

  /**
   * Track a single event for a user
   */
  async trackEvent(
    userMongoId: string,
    eventName: string,
    attributes: Record<string, any> = {},
  ) {
    try {
      const payload: MoEngageEvent = {
        customer_id: userMongoId,
        type: 'event',
        actions: [
          {
            action: eventName,
            attributes: attributes,
            platform: 'unknown',
            device_time: new Date().toISOString(),
          },
        ],
      };

      const response: any = await this.axiosService.post(
        `${this.baseUrl}/event/${this.config.appId}`,
        payload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.appId + ':' + this.config.apiKey).toString('base64')}`,
          },
        },
      );

      this.logger.debug(
        `Event tracked successfully: ${eventName} for user ${userMongoId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to track event: ${eventName}`, error);
      throw error;
    }
  }

  /**
   * Track multiple events for a user in a single request
   */
  async trackBulkEvents(
    userMongoId: string,
    events: Array<{ name: string; attributes: Record<string, any> }>,
  ) {
    try {
      const payload: MoEngageEvent = {
        type: 'event',
        customer_id: userMongoId,
        actions: events.map((event) => ({
          action: event.name,
          attributes: event.attributes,
          platform: 'unknown',
          device_time: new Date().toISOString(),
        })),
      };

      const response: any = await this.axiosService.post(
        `${this.baseUrl}/event/${this.config.appId}`,
        payload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.appId + ':' + this.config.apiKey).toString('base64')}`,
          },
        },
      );

      this.logger.debug(
        `Bulk events tracked successfully for user ${userMongoId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to track bulk events', error);
      throw error;
    }
  }

  /**
   * Update user attributes
   */
  async updateUserAttributes(userId: string, attributes: Record<string, any>) {
    try {
      const payload: MoEngageUser = {
        type: 'customer',
        customer_id: userId,
        attributes,
      };

      const response: any = await this.axiosService.post(
        `${this.baseUrl}/customer/${this.config.appId}`,
        payload,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.appId + ':' + this.config.apiKey).toString('base64')}`,
          },
        },
      );

      this.logger.debug(
        `User attributes updated successfully for user ${userId}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to update user attributes for user ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete a user from MoEngage
   */
  async deleteUser(userId: string) {
    try {
      const response = await this.axiosInstance.delete(
        `${this.baseUrl}/apps/${this.config.appId}/customers/${userId}`,
      );

      this.logger.debug(`User ${userId} deleted successfully`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Add user to an existing segment
   */
  async addUserToSegment(userId: string, segmentId: string) {
    try {
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/apps/${this.config.appId}/segments/${segmentId}/customers`,
        {
          type: 'customer',
          customer_id: userId,
        },
      );

      this.logger.debug(
        `User ${userId} added to segment ${segmentId} successfully`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to add user ${userId} to segment ${segmentId}`,
        error,
      );
      throw error;
    }
  }
}
