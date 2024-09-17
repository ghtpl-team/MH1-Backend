import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateJournalEntryDTO,
  UpdateJournalSecurityDto,
} from './dto/journals.dto';
import { JournalNotes, Status, UserPreferences } from 'src/app.entities';

@Injectable()
export class JournalsService {
  constructor(private readonly em: EntityManager) {}

  async createEntry(
    journalData: CreateJournalEntryDTO & { user: number },
  ): Promise<string> {
    try {
      const journalEntry = this.em.create(JournalNotes, journalData);
      await this.em.flush();
      return `journal entry with id ${journalEntry.id} created successfully.`;
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(userId: number): Promise<Partial<JournalNotes>[]> {
    try {
      const journalEntries = await this.em
        .createQueryBuilder(JournalNotes)
        .select(['id', 'date', 'title', 'content', 'isShared'])
        .where({
          user: {
            id: userId,
          },
          status: Status.ACTIVE,
        });

      return journalEntries;
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
}
