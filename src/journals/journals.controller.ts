import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import {
  CreateJournalEntryDTO,
  UpdateJournalEntryDto,
  UpdateJournalSecurityDto,
} from './dto/journals.dto';

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
  async journalLock(
    @Query('userId') userId: string,
    @Body() updateJournalSecurityDto: UpdateJournalSecurityDto,
  ) {
    return this.journalService.toggleJournalLock(
      updateJournalSecurityDto,
      parseInt(userId),
    );
  }
}
