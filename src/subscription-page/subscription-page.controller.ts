import { Controller, Get } from '@nestjs/common';
import { SubscriptionPageService } from './subscription-page.service';

@Controller('subscription-page')
export class SubscriptionPageController {
  constructor(
    private readonly subscriptionPageService: SubscriptionPageService,
  ) {}

  @Get()
  async fetchSubscriptionPage() {
    return await this.subscriptionPageService.fetch();
  }
}
