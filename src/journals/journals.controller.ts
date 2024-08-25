import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalEntryDTO } from './dto/journals.dto';

@Controller('users/:userId/journals')
export class JournalsController {
  constructor(private readonly journalService: JournalsService) {}

  @Post('/add')
  async createJournalEntry(
    @Body() createJournalEntryDto: CreateJournalEntryDTO,
    @Req() req: Request,
    @Param('userId') mhUserId: string,
  ) {
    const userId = parseInt(mhUserId);
    return this.journalService.createEntry({
      ...createJournalEntryDto,
      user: userId,
    });
  }

  @Get('/list')
  async fetchAllJournalEntries(@Param('userId') mhUserId: string) {
    const userId = parseInt(mhUserId);
    return this.journalService.findAllByUserId(userId);
  }

  @Get(':id')
  async fetchJournalEntry(@Param('id') id: string) {
    const journalId = parseInt(id);
    return this.journalService.findById(journalId);
  }
}
