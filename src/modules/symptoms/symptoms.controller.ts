import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { LogSymptomsDto } from './dto/symptoms.dto';

@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get('categories')
  async getSymptomCategories() {
    return this.symptomsService.fetchSymptomCategories();
  }

  @Post('add')
  async logSymptoms(
    @Query('userId') userId: string,
    @Body() logSymptomsDto: LogSymptomsDto,
  ) {
    if (!userId) {
      throw new HttpException('userId is required!', HttpStatus.BAD_REQUEST);
    }
    return this.symptomsService.addSymptoms(logSymptomsDto, parseInt(userId));
  }

  @Get()
  async getLoggedSymptoms(@Query('userId') userId: string) {
    const symptoms = await this.symptomsService.fetchLoggedSymptoms(
      parseInt(userId),
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
