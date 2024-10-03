import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import {
  CreateJournalEntryDTO,
  UpdateJournalEntryDto,
  UpdateJournalSecurityDto,
} from './dto/journals.dto';
import { CustomAuthGuard } from '../auth/custom-auth.guard';

@Controller('users/:userId/journals')
export class JournalsController {
  constructor(private readonly journalService: JournalsService) {}

  @Post('/add')
  async createJournalEntry(
    @Body() createJournalEntryDto: CreateJournalEntryDTO,
    @Req() req: Request,
    @Headers('x-mh-v3-user-id') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.journalService.createEntry({
      ...createJournalEntryDto,
      user: userId,
    });
  }

  @Get('/list')
  async fetchAllJournalEntries(@Headers('x-mh-v3-user-id') mhUserId: string) {
    const userId = parseInt(mhUserId);
    return this.journalService.findAllByUserId(userId);
  }

  @Get(':id')
  async fetchJournalEntry(@Param('id') id: string) {
    const journalId = parseInt(id);
    return this.journalService.findById(journalId);
  }

  @Patch('delete')
  async deleteJournalEntry(@Query('id') id: string) {
    const journalId = parseInt(id);
    return this.journalService.delete(journalId);
  }

  @Patch('update')
  async updateJournalEntry(
    @Query('id') id: string,
    @Body() updateJournalEntryDto: UpdateJournalEntryDto,
  ) {
    if (!id)
      throw new HttpException(
        'Required Params missing',
        HttpStatus.BAD_REQUEST,
      );
    const journalId = parseInt(id);
    return this.journalService.update(journalId, updateJournalEntryDto);
  }

  @Patch('security')
  @UseGuards(CustomAuthGuard)
  async journalLock(
    @Headers('x-mh-v3-user-id') userId: string,
    @Body() updateJournalSecurityDto: UpdateJournalSecurityDto,
  ) {
    return this.journalService.toggleJournalLock(
      updateJournalSecurityDto,
      parseInt(userId),
    );
  }
}
