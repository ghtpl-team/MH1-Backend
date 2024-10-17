import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateJournalEntryDTO,
  UpdateJournalEntryDto,
  UpdateJournalSecurityDto,
} from './dto/journals.dto';

import { Status } from 'src/entities/base.entity';
import { JournalNotes } from 'src/entities/journal-notes.entity';
import { UserPreferences } from 'src/entities/user-preferences.entity';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';

@Injectable()
export class JournalsService {
  private readonly logger = new Logger(JournalsService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly dayjsService: DayjsService,
  ) {}

  async createEntry(
    journalData: CreateJournalEntryDTO & { user: number },
  ): Promise<string> {
    try {
      const journalEntry = this.em.create(JournalNotes, journalData);
      await this.em.flush();
      return `journal entry with id ${journalEntry.id} created successfully.`;
    } catch (error) {
      this.logger.error(
        'Error while creating journal entry',
        error?.stack ?? error,
      );
      throw error;
    }
  }

  async findAllByUserId(userId: number): Promise<Partial<JournalNotes>[]> {
    try {
      const journalEntries = await this.em
        .createQueryBuilder(JournalNotes)
        .select(['id', 'date', 'title', 'content', 'isShared', 'updatedAt'])
        .where({
          user: {
            id: userId,
          },
          status: Status.ACTIVE,
        })
        .orderBy({
          updatedAt: QueryOrder.DESC,
        })
        .execute();

      return journalEntries.map((entry) => ({
        ...entry,
        updatedAt: undefined,
        time: this.dayjsService.convertToLocalTime(entry.updatedAt),
      }));
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Partial<JournalNotes>> {
    try {
      const journalEntry = await this.em
        .createQueryBuilder(JournalNotes)
        .select(['id', 'title', 'content', 'date', 'isShared'], true)
        .where({
          id,
          status: Status.ACTIVE,
        })
        .limit(1);

      if (!journalEntry || !journalEntry.length) {
        throw new HttpException(
          'No entry with given id exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      return journalEntry[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const updateResponse = await this.em.nativeUpdate(
        JournalNotes,
        {
          id,
        },
        {
          status: Status.DELETED,
        },
      );
      return `${updateResponse} journal entry deleted successfully`;
    } catch (error) {
      throw error;
    }
  }

  async toggleJournalLock(
    updateData: UpdateJournalSecurityDto,
    userId: number,
  ) {
    try {
      const updateResObj = await this.em.nativeUpdate(
        UserPreferences,
        {
          user: userId,
        },
        {
          isJournalLocked: updateData.isLocked,
        },
      );
      if (updateResObj === 0)
        throw new HttpException('Nothing to update', HttpStatus.BAD_REQUEST);
      return `lock toggled successfully`;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, reqBody: UpdateJournalEntryDto) {
    try {
      const updateStatus = await this.em.nativeUpdate(
        JournalNotes,
        {
          id,
        },
        {
          ...reqBody,
        },
      );
      if (updateStatus)
        return { status: true, message: `${updateStatus} records updated!` };
      throw new HttpException('No data for given Id', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(
        'Error while updating journal entry',
        error?.stack ?? error,
      );
      throw error;
    }
  }
}
