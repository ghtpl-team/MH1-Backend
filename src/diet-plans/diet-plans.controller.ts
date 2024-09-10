import { Controller, Get } from '@nestjs/common';
import { DietPlansService } from './diet-plans.service';

@Controller('diet-plans')
export class DietPlansController {
  constructor(private readonly dietPlanService: DietPlansService) {}

  @Get('learn-more')
  async fetchLearnMore() {
    return this.dietPlanService.learnMoreData();
  }
}
