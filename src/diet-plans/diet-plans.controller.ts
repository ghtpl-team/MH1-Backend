import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { DietPlansService } from './diet-plans.service';

@Controller('diet-plans')
export class DietPlansController {
  constructor(private readonly dietPlanService: DietPlansService) {}

  @Get('learn-more')
  async fetchLearnMore() {
    return this.dietPlanService.learnMoreData();
  }

  @Get('intro')
  async fetchIntroStories(@Query('trimester') trimester: string) {
    if (!trimester)
      throw new HttpException(
        'Required params missing',
        HttpStatus.BAD_REQUEST,
      );
    return this.dietPlanService.introStories(parseInt(trimester));
  }
}
