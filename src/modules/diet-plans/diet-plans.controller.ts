import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DietPlansService } from './diet-plans.service';
import { DietPlanInfoFormDto } from './dto/diet-plan.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('diet-plans')
@ApiTags('Diet Plans')
@ApiBearerAuth()
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
  @UseGuards(CustomAuthGuard)
  async fetchDietPlan(
    @Headers('x-mh-v3-user-id') userId: string,
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
  @UseGuards(CustomAuthGuard)
  async submitForm(
    @Headers('x-mh-v3-user-id') userId: string,
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
