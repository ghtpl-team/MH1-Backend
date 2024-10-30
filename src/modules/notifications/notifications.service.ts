import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Status } from 'src/entities/base.entity';
import { User } from 'src/entities/user.entity';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';
import { UsersService } from '../user/users.service';
import { MoEngageService } from 'src/utils/moengage/moengage.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly dayjsService: DayjsService,
    private readonly em: EntityManager,
    private readonly userService: UsersService,
    private readonly moEngageService: MoEngageService,
  ) {}

  @Cron('30 4 */1 * *')
  async weekUpdateCron() {
    try {
      let hasNextPage = true;
      let endCursor = null;
      const fork = this.em.fork();
      while (hasNextPage) {
        const users = await fork.findByCursor(
          User,
          {
            status: Status.ACTIVE,
          },
          {
            first: 50,
            after: {
              endCursor,
            },
            orderBy: {
              id: QueryOrder.ASC,
            },
          },
        );

        for (const user of users) {
          if (!user.mongoId) {
            continue;
          }
          const { predictedStartDate, currentWeek } =
            this.userService.calculateCurrentPregnancyWeek(
              user.expectedDueDate,
            );

          if (
            this.dayjsService.getCurrentDay() ===
            this.dayjsService.getDay(predictedStartDate)
          ) {
            await this.moEngageService.trackEvent(
              user.mongoId,
              'APP_WEEK_UPDATE',
              {
                'Current Pregnancy Week': currentWeek,
              },
            );
            await this.moEngageService.updateUserAttributes(user.mongoId, {
              'Current Pregnancy Week': currentWeek,
            });
          }
        }

        hasNextPage = users.hasNextPage;
        endCursor = users.endCursor;
      }
    } catch (error) {
      this.logger.error('cron for week update notification failed', error);
      throw error;
    }
  }
}
