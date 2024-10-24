import { Controller, Get } from '@nestjs/common';
import { UnsubscribedHomeService } from './unsubscribed-home.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('unsubscribed-home')
@ApiTags('Unsubscribed Home')
@ApiBearerAuth()
export class UnsubscribedHomeController {
  constructor(
    private readonly unsubscribedHomeService: UnsubscribedHomeService,
  ) {}

  @Get()
  async getUnsubscribedHome() {
    return await this.unsubscribedHomeService.fetchUnsubscribedHome();
  }

  @Get('introduction')
  async introCards() {
    return await this.unsubscribedHomeService.fetchIntroCards();
  }
}
