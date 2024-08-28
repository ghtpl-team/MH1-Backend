import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { KickCounterService } from './kick-counter.service';
import {
  CreateKickSessionDto,
  DeleteKickSessionDto,
  UpdateKickSessionDto,
} from './dto/kick-counter.dto';

@Controller('user/:userId/kick-counter')
export class KickCounterController {
  constructor(private readonly kcService: KickCounterService) {}

  @Post()
  async createKickSession(
    @Body() createKickSessionDto: CreateKickSessionDto,
    @Req() req: Request,
    @Param('userId') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.kcService.create(createKickSessionDto, userId);
  }

  @Get('history')
  async fetchKickSessions(
    @Req() req: Request,
    @Query('dateRange')
    dateRange: 'last_7_days' | 'last_30_days' | 'last_60_days',
  ) {
    return this.kcService.fetchAllByDate(dateRange);
  }

  @Patch(':id')
  async updateKickSession(
    @Body() updateKickSessionDto: UpdateKickSessionDto,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const kcId = parseInt(id);
    return this.kcService.update(updateKickSessionDto, kcId);
  }

  @Delete()
  async deleteKickSession(
    @Body() deleteKickSessionDto: DeleteKickSessionDto,
    @Param('userId') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.kcService.deleteByDate(deleteKickSessionDto.date, userId);
  }
}
