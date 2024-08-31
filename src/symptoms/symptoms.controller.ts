import { Controller, Get } from '@nestjs/common';
import { SymptomsService } from './symptoms.service';

@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get('categories')
  async getSymptomCategories() {
    return this.symptomsService.fetchSymptomCategories();
  }
}
