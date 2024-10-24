import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { LogSymptomsDto } from './dto/symptoms.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('symptoms')
@ApiTags('Symptoms')
@ApiBearerAuth()
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get('categories')
  async getSymptomCategories() {
    return this.symptomsService.fetchSymptomCategories();
  }

  @Post('add')
  @UseGuards(CustomAuthGuard)
  async logSymptoms(
    @Headers('x-mh-v3-user-id') userId: string,
    @Body() logSymptomsDto: LogSymptomsDto,
  ) {
    if (!userId) {
      throw new HttpException('userId is required!', HttpStatus.BAD_REQUEST);
    }
    return this.symptomsService.addSymptoms(logSymptomsDto, parseInt(userId));
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @UseGuards(CustomAuthGuard)
  async getLoggedSymptoms(
    @Headers('x-mh-v3-user-id') userId: string,
    @Query('page', new DefaultValuePipe('1')) page: string,
    @Query('limit', new DefaultValuePipe('10')) limit: string,
  ) {
    const symptoms = await this.symptomsService.fetchLoggedSymptoms(
      parseInt(userId),
      parseInt(page),
      parseInt(limit),
    );
    return symptoms;
  }

  @Patch()
  async updateLoggedSymptoms(
    @Body() logSymptomsDto: LogSymptomsDto,
    @Query('id') id: string,
  ) {
    if (!id) {
      throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
    }
    return this.symptomsService.updateSymptoms(logSymptomsDto, parseInt(id));
  }
}
