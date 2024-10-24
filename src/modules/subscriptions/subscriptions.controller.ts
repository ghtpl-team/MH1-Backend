import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CancelSubscriptionDto,
  CreateSubscriptionDto,
  SubscriptionPlanDto,
} from './dto/subscriptions.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Post('plan/create')
  async createPlan(@Body() planDetails: SubscriptionPlanDto) {
    return this.subscriptionService.createNewPlan(planDetails);
  }

  @Post('add')
  @UseGuards(CustomAuthGuard)
  async subscribe(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Headers('x-mh-v3-user-id') userId: string,
  ) {
    if (!userId)
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
    return this.subscriptionService.subscribe(
      createSubscriptionDto,
      parseInt(userId),
    );
  }

  @Patch('cancel')
  @UseGuards(CustomAuthGuard)
  async cancelSubscription(
    @Headers('x-mh-v3-user-id') userId: string,
    cancelSubscriptionDto: CancelSubscriptionDto,
  ) {
    if (!userId)
      throw new HttpException(
        'required params are missing',
        HttpStatus.BAD_REQUEST,
      );
    return this.subscriptionService.cancel(
      parseInt(userId),
      cancelSubscriptionDto,
    );
  }

  @Get('active')
  @UseGuards(CustomAuthGuard)
  async fetchSubscriptionDetails(@Headers('x-mh-v3-user-id') userId: string) {
    if (!userId)
      throw new HttpException(
        'required params are missing',
        HttpStatus.BAD_REQUEST,
      );
    return this.subscriptionService.getSubscriptionDetails(parseInt(userId));
  }
}
