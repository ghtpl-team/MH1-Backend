export interface SubscriptionWebhookPayload {
  entity: string;
  accountId: string;
  event: string;
  contains: string[];
  payload: Record<string, any>;
  createdAt: string;
}
