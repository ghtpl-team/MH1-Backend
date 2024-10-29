import { Controller, Get } from '@nestjs/common';
import { SubscriptionPageService } from './subscription-page.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('subscription-page')
@ApiTags('Subscription Page')
@ApiBearerAuth()
export class SubscriptionPageController {
  constructor(
    private readonly subscriptionPageService: SubscriptionPageService,
  ) {}

  @Get()
  async fetchSubscriptionPage() {
    return await this.subscriptionPageService.fetch();
  }

  @Get('terms-and-conditions')
  async fetchTermsAndConditions() {
    return await this.subscriptionPageService.fetchTermsAndCondition();
  }
}
