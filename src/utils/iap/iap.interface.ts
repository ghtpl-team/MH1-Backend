export interface IAPProvider {
  verifyPurchase(data: any, userId: number);
}

export interface AppleIAPSubscriptionStatus {
  status: string;
  expirationDate: string;
  productId: string;
}
