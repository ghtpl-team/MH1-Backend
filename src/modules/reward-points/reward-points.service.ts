import { raw } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, Logger } from '@nestjs/common';
import { SYSTEM_SETTING } from 'src/configs/system.config';
import { Status } from 'src/entities/base.entity';
import {
  RewardPointsAggregate,
  RewardPointsEarnedType,
} from 'src/entities/reward-point-aggregation.entity';

@Injectable()
export class RewardPointsService {
  private readonly logger = new Logger(RewardPointsService.name);

  constructor(private readonly em: EntityManager) {}

  async upsert(userId: number, type: RewardPointsEarnedType) {
    try {
      const qb = this.em.createQueryBuilder(RewardPointsAggregate);
      const entryExist = await this.em.count(RewardPointsAggregate, {
        user: userId,
        type,
      });

      if (entryExist === 0) {
        this.em.create(RewardPointsAggregate, {
          user: userId,
          type,
          points: 0,
        });
        await this.em.flush();
      }

      const updatedPoints = await qb.update({
        points: raw(`points + ${SYSTEM_SETTING.activityPoints[type]}`),
      });
      return updatedPoints;
    } catch (error) {
      this.logger.error(
        'Error in RewardPointsService.upsert',
        error?.stack || error,
      );
      throw error;
    }
  }

  private parseRewardPoints(points: RewardPointsAggregate[]) {
    try {
      const pointsMap = points.reduce(
        (acc, curr) => {
          acc[curr.type] += curr.points;
          acc.total += curr.points;
          return acc;
        },
        {
          total: 0,
          [RewardPointsEarnedType.FITNESS_GOAL_ACHIEVED]: 0,
          [RewardPointsEarnedType.MIND_GOAL_ACHIEVED]: 0,
          [RewardPointsEarnedType.NUTRITION_GOAL_ACHIEVED]: 0,
          [RewardPointsEarnedType.SOUL_GOAL_ACHIEVED]: 0,
          [RewardPointsEarnedType.WATER_GOAL_ACHIEVED]: 0,
        },
      );
      return pointsMap;
    } catch (error) {
      this.logger.error(
        'Error in RewardPointsService.parseRewardPoints',
        error?.stack || error,
      );
      throw error;
    }
  }

  async getRewardPoints(userId: number) {
    try {
      const points = await this.em.find(RewardPointsAggregate, {
        user: userId,
        status: Status.ACTIVE,
      });
      return this.parseRewardPoints(points);
    } catch (error) {
      this.logger.error(
        'Error in RewardPointsService.getRewardPoints',
        error?.stack || error,
      );
      throw error;
    }
  }
}
