import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { User, UserPreferences } from 'src/app.entities';
import { adjustTime } from 'src/common/utils/date-time.utils';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly em: EntityManager) {}

  private dtoToUserPrefCreateObj(
    userPreferencesData: UserPreferencesDto,
    userId: number,
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
      user: userId,
    };
  }

  async create(
    userPreferencesData: UserPreferencesDto,
    userId: number,
  ): Promise<UserPreferences> {
    try {
      const createUserPreferencesObj = this.dtoToUserPrefCreateObj(
        userPreferencesData,
        userId,
      );
      const userPreference = this.em.create(
        UserPreferences,
        createUserPreferencesObj,
      );
      await this.em.flush();
      return userPreference;
    } catch (error) {
      throw new HttpException(
        'Unable to set user preferences',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
