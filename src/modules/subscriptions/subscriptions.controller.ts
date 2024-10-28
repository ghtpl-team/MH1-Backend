import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CancelSubscriptionDto,
  CreateSubscriptionDto,
  SubscriptionPlanDto,
  UpdateSubscriptionDto,
} from './dto/subscriptions.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('subscriptions')
@ApiTags('Subscriptions')
@ApiBearerAuth()
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

  @Patch('update')
  @UseGuards(CustomAuthGuard)
  async updateSubscription(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('rpSubscriptionId') rpSubscriptionId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    if (!userId)
      throw new HttpException(
        'required params are missing',
        HttpStatus.BAD_REQUEST,
      );
    return this.subscriptionService.update(
      parseInt(userId),
      rpSubscriptionId,
      updateSubscriptionDto,
    );
  }
}
