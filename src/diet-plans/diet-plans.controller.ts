import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { DietPlansService } from './diet-plans.service';
import { DietPlanInfoFormDto } from './dto/diet-plan.dto';

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

  @Post('form/submit')
  async submitForm(
    @Query('userId') userId: string,
    @Body() formDataDto: DietPlanInfoFormDto,
  ) {
    if (!userId)
      throw new HttpException(
        'Required params missing',
        HttpStatus.BAD_REQUEST,
      );

    return this.dietPlanService.submitForm(parseInt(userId), formDataDto);
  }
}
