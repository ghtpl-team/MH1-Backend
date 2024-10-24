import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KickCounterService } from './kick-counter.service';
import {
  CreateKickSessionDto,
  DeleteKickSessionDto,
  UpdateKickSessionDto,
} from './dto/kick-counter.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('user/:userId/kick-counter')
@ApiTags('Kick Counter')
@ApiBearerAuth()
export class KickCounterController {
  constructor(private readonly kcService: KickCounterService) {}

  @Post()
  @UseGuards(CustomAuthGuard)
  async createKickSession(
    @Body() createKickSessionDto: CreateKickSessionDto,
    @Req() req: Request,
    @Headers('x-mh-v3-user-id') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.kcService.create(createKickSessionDto, userId);
  }

  @Get('history')
  @UseGuards(CustomAuthGuard)
  async fetchKickSessions(
    @Req() req: Request,
    @Query('dateRange')
    dateRange: 'last_7_days' | 'last_30_days' | 'last_60_days',
    @Headers('x-mh-v3-user-id')
    mhUserId: string,
  ) {
    return this.kcService.fetchAllByDate(dateRange, parseInt(mhUserId));
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
  @UseGuards(CustomAuthGuard)
  async deleteKickSession(
    @Body() deleteKickSessionDto: DeleteKickSessionDto,
    @Headers('x-mh-v3-user-id') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.kcService.deleteByDate(deleteKickSessionDto.date, userId);
  }
}
