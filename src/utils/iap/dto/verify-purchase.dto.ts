import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyPurchaseDto {
  @IsNotEmpty()
  @IsString()
  receiptData: string;

  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsNumber()
  totalBillingCycle: number;
}
