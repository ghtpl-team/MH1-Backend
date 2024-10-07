import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserPreferencesDto } from './dto/user-preferences.dto';

import { adjustTime } from 'src/common/utils/date-time.utils';
import { UserPreferences } from 'src/entities/user-preferences.entity';

@Injectable()
export class UserPreferencesService {
  private readonly logger = new Logger(UserPreferencesService.name);
  constructor(private readonly em: EntityManager) {}

  private dtoToUserPrefCreateObj(
    userPreferencesData: UserPreferencesDto,
  ): Partial<UserPreferences> | { user: number } {
    const { breakfastTiming, lunchTiming, dinnerTiming } = userPreferencesData;
    if (!breakfastTiming || !lunchTiming || !dinnerTiming) return {};
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
  ): Promise<Record<string, string>> {
    try {
      const createUserPreferencesObj =
        this.dtoToUserPrefCreateObj(userPreferencesData);

      const userPreference = await this.em.nativeUpdate(
        UserPreferences,
        {
          user: userId,
        },
        {
          ...createUserPreferencesObj,
          ...(userPreferencesData.isActivityLocked !== undefined && {
            isJournalLocked: false,
          }),
        },
      );

      if (userPreference === 0)
        throw new HttpException(
          'Unable to set user preferences',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      this.logger.log(`user preference updated for ${userPreference} users.`);
      return {
        msg: `user preference updated for ${userPreference} users.`,
      };
    } catch (error) {
      this.logger.error(`Unable to set user preferences`, error.stack || error);
      throw new HttpException(
        'Unable to set user preferences',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
