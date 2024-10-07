import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserPreferencesDto } from './dto/user-preferences.dto';

import { adjustTime } from 'src/common/utils/date-time.utils';
import { UserPreferences } from 'src/entities/user-preferences.entity';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly em: EntityManager) {}

  private dtoToUserPrefCreateObj(
    userPreferencesData: UserPreferencesDto,
  ): Partial<UserPreferences> | { user: number } {
    const { breakfastTiming, lunchTiming, dinnerTiming } = userPreferencesData;
    return {
      beforeBreakFast: adjustTime(breakfastTiming, -30),
      afterBreakFast: adjustTime(breakfastTiming, 30),
      beforeLunch: adjustTime(lunchTiming, -30),
      afterLunch: adjustTime(lunchTiming, 30),
      beforeDinner: adjustTime(dinnerTiming, -30),
      afterDinner: adjustTime(dinnerTiming, 30),
      beforeBedTime: adjustTime(dinnerTiming, 90),
    };
  }

  async update(
    userPreferencesData: UserPreferencesDto,
    userId: number,
    id: number,
  ): Promise<string> {
    try {
      const createUserPreferencesObj =
        this.dtoToUserPrefCreateObj(userPreferencesData);

      const userPreference = await this.em.nativeUpdate(
        UserPreferences,
        {
          id,
          user: userId,
        },
        {
          ...createUserPreferencesObj,
          ...(userPreferencesData.isActivityLocked && {
            isJournalLocked: false,
          }),
        },
      );
      return `user preference updated for ${userPreference} users.`;
    } catch (error) {
      throw new HttpException(
        'Unable to set user preferences',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
