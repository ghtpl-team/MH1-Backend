import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { SubscriptionPlanPeriod } from 'src/app.entities';
import { CurrencyCode } from 'src/common/enums/razorpay.enums';

export class SubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(SubscriptionPlanPeriod)
  period: 'yearly' | 'monthly' | 'daily' | 'weekly';

  @ApiProperty()
  @IsNumber()
  interval: number;

  @ApiProperty()
  @IsNumber()
  amountX100: number;

  @ApiProperty()
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;
}

export class CreateSubscriptionDto {
  @IsString()
  @ApiProperty()
  planId: string;

  @IsInt()
  @ApiProperty()
  totalBillingCycle: number = 1;
}
