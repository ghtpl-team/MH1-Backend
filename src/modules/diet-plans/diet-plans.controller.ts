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
import { ApiQuery } from '@nestjs/swagger';

@Controller('diet-plans')
export class DietPlansController {
  constructor(private readonly dietPlanService: DietPlansService) {}

  @ApiQuery({ name: 'userId', required: true, type: 'string', example: '1' })
  @ApiQuery({
    name: 'weekNumber',
    required: true,
    type: 'string',
    example: '1',
  })
  @Get()
  async fetchDietPlan(
    @Query('userId') userId: string,
    @Query('weekNumber') weekNumber: string,
  ) {
    if (!userId || !weekNumber) {
      throw new HttpException(
        'Required params missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.dietPlanService.fetchDietPlan(
      parseInt(userId),
      parseInt(weekNumber),
    );
  }

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
