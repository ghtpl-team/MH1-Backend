export interface MoEngageConfig {
  dataCenter: string;
  appId: string;
  apiKey: string;
}

export interface MoEngageEvent {
  customer_id: string;
  type: string;
  actions: Array<{
    action: string;
    attributes: Record<string, any>;
    platform: string;
    device_time: string;
  }>;
}

export interface MoEngageUser {
  type: string;
  customer_id: string;
  attributes: Record<string, any>;
}
