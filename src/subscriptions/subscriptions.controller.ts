import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from './dto/subscriptions.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Post('plan/create')
  async createPlan(@Body() planDetails: SubscriptionPlanDto) {
    return this.subscriptionService.createNewPlan(planDetails);
  }

  @Post('add')
  async subscribe(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Query('userId') userId: string,
  ) {
    if (!userId)
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    return this.subscriptionService.subscribe(
      createSubscriptionDto,
      parseInt(userId),
    );
  }
}
