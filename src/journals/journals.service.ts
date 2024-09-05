import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJournalEntryDTO } from './dto/journals.dto';
import { JournalNotes, Status } from 'src/app.entities';

@Injectable()
export class JournalsService {
  constructor(private readonly em: EntityManager) {}

  async createEntry(
    journalData: CreateJournalEntryDTO & { user: number },
  ): Promise<JournalNotes> {
    try {
      const journalEntry = this.em.create(JournalNotes, journalData);
      await this.em.flush();
      return journalEntry;
    } catch (error) {
      throw new HttpException(
        'request failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      return updateResponse;
    } catch (error) {
      throw error;
    }
  }

  // async toggleJournalLock(
  //   updateData: UpdateJournalSecurityDto,
  //   userId: number,
  // ) {
  //   try {
  //     const updateResObj = this.em.nativeUpdate(
  //       UserPreferences,
  //       {
  //         user: userId,
  //       },
  //       {
  //         isJournalLocked: updateData.isLocked,
  //       },
  //     );
  //     return updateResObj;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
