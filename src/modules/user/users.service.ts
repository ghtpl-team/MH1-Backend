import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  ParsedDocCard,
  ParsedMultiPoll,
  ParsedSinglePoll,
  ParsedSliderCard,
  RawDynamicFormData,
} from './user.interface';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { DYNAMIC_FORM } from './user.query';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { Status } from 'src/entities/base.entity';

import { User } from 'src/entities/user.entity';
import {
  ReminderType,
  Schedule,
  ScheduledBy,
} from 'src/entities/schedules.entity';
import {
  SubscriptionStatus,
  Subscriptions,
} from 'src/entities/subscriptions.entity';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';
import { SYSTEM_SETTING } from 'src/configs/system.config';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly graphqlClient: GraphQLClientService,
    private readonly dayjsService: DayjsService,
  ) {}

  /**
   * Asynchronously finds a user by their phone number.
   *
   * @param phoneNumber - The phone number of the user to find.
   * @returns An object containing the user's id, phone, status, and public UUID if found,
   *          or null if no user is found or an error occurs.
   */
  async findOneByPhoneNumber(phoneNumber: string) {
    try {
      const user = await this.em.findOneOrFail(
        User,
        { phone: phoneNumber },
        { strict: true },
      );
      return {
        id: user.id,
        phone: user.phone,
        status: user.status,
        uuid: user.publicUuid,
      };
    } catch (error) {
      return null;
    }
  }

  async findOneByDeviceId(deviceId: string) {
    try {
      const user = await this.em.findOneOrFail(
        User,
        { deviceId: deviceId },
        { strict: true },
      );
      return {
        id: user.id,
        phone: user.phone,
        status: user.status,
        expectedDueDate: user.expectedDueDate,
        uuid: user.publicUuid,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Creates a new user
   * If the user does not exist, it creates a new user along with default activity schedules.
   *
   * @param userData - Partial user data containing at least the phone number.
   * @returns A promise that resolves to an object containing the user's id, phone, and status.
   */
  async create(
    userData: Partial<User>,
  ): Promise<
    Pick<User, 'id' | 'phone' | 'status' | 'expectedDueDate'> & { uuid: string }
  > {
    try {
      const activityTasks = [
        ReminderType.WATER_REMINDER,
        ReminderType.DIET_REMINDER,
        ReminderType.SOUL_REMINDER,
        ReminderType.MIND_REMINDER,
        ReminderType.FITNESS_REMINDER,
      ];

      const user = this.em.create(User, userData);

      const schedules = activityTasks.map((task) => {
        return this.em.create(Schedule, {
          type: task,
          reminderTime: SYSTEM_SETTING.defaultReminders[task],
          scheduledTasks: {
            type: task,
            user: user,
          },
          user: user,
        });
      });

      await this.em.persistAndFlush([user, ...schedules]);

      return {
        id: user.id,
        phone: user.phone,
        status: user.status,
        expectedDueDate: user.expectedDueDate,
        uuid: user.publicUuid,
      };
    } catch (error) {
      this.logger.error(
        `Error creating user: ${JSON.stringify(error.message)}`,
        error.stack || error,
      );
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.em.find(User, { status: Status.ACTIVE });
  }

  private calculateCurrentPregnancyWeek(expectedDate: string) {
    try {
      const today = this.dayjsService.getCurrentDate();
      const predictedStartDate = this.dayjsService.addDays(expectedDate, -280);
      const predictedCurrentWeek =
        this.dayjsService.getDiff(today, predictedStartDate, 'weeks') + 1;
      const predictedCurrentTrimester =
        Math.floor(predictedCurrentWeek / 14) + 1;
      return {
        predictedStartDate: predictedStartDate,
        currentWeek: predictedCurrentWeek,
        trimester: predictedCurrentTrimester,
      };
    } catch (error) {
      throw error;
    }
  }

  private parseUserData(
    userData: User[],
    subscriptionStatus: string,
    isDietFormFilled: boolean,
  ) {
    const expectedDate = '2025-05-30'; // TODO: Static Fix this
    const { userPreferences } = userData[0];
    const isPreferencesLogged = userPreferences.lunchTime ? true : false;
    return {
      id: userData[0].id,
      phone: userData[0].phone,
      userRecord: this.calculateCurrentPregnancyWeek(expectedDate),
      isPreferencesLogged,
      userMealTimings: isPreferencesLogged
        ? {
            breakfast: userPreferences.breakfastTime,
            lunch: userPreferences.lunchTime,
            dinner: userPreferences.dinnerTime,
          }
        : undefined,
      isDietFormFilled,
      isSubscribed:
        subscriptionStatus === SubscriptionStatus.ACTIVE ? true : false,
      userSettings: userData[0].userPreferences
        ? {
            id: userData[0].userPreferences.id,
            isActivityLocked: userData[0].userPreferences.isActivityLocked
              ? true
              : false,
            isJournalLocked: userData[0].userPreferences.isJournalLocked
              ? true
              : false,
          }
        : null,
      schedules: userData[0].schedules.length
        ? userData[0].schedules.map((schedule) => {
            return {
              id: schedule.id,
              scheduledBy: schedule.scheduledBy,
              type: schedule.type,
              time:
                schedule.scheduledBy === ScheduledBy.SYSTEM
                  ? null
                  : schedule.reminderTime,
            };
          })
        : [],
    };
  }

  private async cachedData(userId: number) {
    try {
      let subscriptionStatus = await this.cacheService.get(userId.toString());
      if (!subscriptionStatus) {
        subscriptionStatus = await this.userSubscriptionStatus(userId);
      }

      const isDietFormFilled: boolean = (await this.cacheService.get(
        `diet-plan-form-${userId}`,
      ))
        ? true
        : false;
      return [subscriptionStatus, isDietFormFilled];
    } catch (error) {
      throw error;
    }
  }

  private async userSubscriptionStatus(userId: number) {
    try {
      const subscriptionInfo = await this.em.findOne(
        Subscriptions,
        {
          user: userId,
        },
        {
          populate: ['id', 'subscriptionStatus'],
          orderBy: {
            updatedAt: QueryOrder.DESC,
            createdAt: QueryOrder.DESC,
          },
        },
      );
      if (!subscriptionInfo) {
        await this.cacheService.set(userId.toString(), 'missing');
        return 'missing';
      }

      await this.cacheService.set(
        userId.toString(),
        subscriptionInfo.subscriptionStatus,
      );
      return subscriptionInfo.subscriptionStatus;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds a user by their ID and retrieves their data, including user preferences and schedules.
   *
   * @param id - The unique identifier of the user to find.
   * @returns A promise that resolves to the parsed user data, including subscription status and diet form status.
   * @throws HttpException if no user exists for the given ID.
   */
  async find(id: number) {
    try {
      const userData = await this.em
        .createQueryBuilder(User, 'u')
        .select(['u.id', 'u.phone', 'u.expectedDueDate'])
        .innerJoinAndSelect('u.userPreferences', 'up', {}, [
          'isActivityLocked',
          'isJournalLocked',
          'breakfastTime',
          'lunchTime',
          'dinnerTime',
        ])
        .innerJoinAndSelect(
          'schedules',
          'sc',
          {
            type: {
              $in: [
                ReminderType.WATER_REMINDER,
                ReminderType.DIET_REMINDER,
                ReminderType.SOUL_REMINDER,
                ReminderType.MIND_REMINDER,
                ReminderType.FITNESS_REMINDER,
                ReminderType.JOURNAL_SCHEDULE,
              ],
            },
          },
          ['id', 'type', 'reminderTime', 'scheduledBy'],
        )
        .where({ id })
        .execute();

      if (userData && userData.length) {
        const [subscriptionStatus, isDietFormFilled] =
          await this.cachedData(id);

        return this.parseUserData(
          userData,
          subscriptionStatus as string,
          isDietFormFilled as boolean,
        );
      }
      throw new HttpException(
        'No user exists for given id',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      throw error;
    }
  }

  private parseDynamicForm(rawData: RawDynamicFormData) {
    const attributes = rawData.dynamicForm?.data?.attributes;

    if (!attributes)
      throw new HttpException('No Data Available', HttpStatus.BAD_REQUEST);

    return {
      cards: attributes.cards.map((card: any) => {
        if (card?.cardType) {
          return {
            id: card.id,
            question: card.question,
            nodeId: card.nodeId,
            goTo: card.goTo,
            hasUnit: card.hasUnit,
            showProgressBar: card.showProgressBar,
            cardType: 'slider',
            sliderRanges: card.sliderRanges.map((range) => ({
              id: range.id,
              min: range.min,
              max: range.max,
            })),
            unit: card.unit,
          } as ParsedSliderCard;
        } else if (card?.singlePollType) {
          return {
            id: card.id,
            questionText: card.questionText,
            nodeId: card.nodeId,
            options: card.options,
            showProgressBar: card.showProgressBar,
            cardType: 'generalPoll',
          } as ParsedSinglePoll;
        } else if (card?.multiPollType) {
          return {
            id: card.id,
            nodeId: card.nodeId,
            header: card.header,
            questions: card.questions.map((question) => ({
              questionText: question.questionText,
              options: question.options,
            })),
            subHeader: card.subHeader,
            cardType:
              card.multiPollType === 'specific question'
                ? 'specificPoll'
                : 'multiplePoll',
            goTo: card.multiPollGoto,
          } as ParsedMultiPoll;
        } else {
          console.log(card);

          return {
            id: card.id,
            heading: card.heading,
            subHeading: card.subHeading,
            nodeId: card.nodeId,
            goTo: card.goTo,
            cardType: '',
            buttons: card.buttons.map((button) => ({
              id: button.id,
              btnText: button.btnText,
              textColor: button.textColor,
              bgColor: button.bgColor,
              goTo: button.goTo,
            })),
            docInfo: {
              name: card.hmsDoctor?.data?.attributes?.name,
              image: getImageUrl(
                card.hmsDoctor?.data?.attributes?.imageUrl,
                false,
              ),
              specialty:
                card.hmsDoctor?.data?.attributes?.specialty?.data?.attributes
                  ?.name,
              experienceYears:
                card.hmsDoctor?.data?.attributes?.experienceYears,
            },
          } as ParsedDocCard;
        }
      }),
    };
  }

  async fetchUserInfoForm() {
    try {
      const formDataRaw: RawDynamicFormData = await this.graphqlClient.query(
        DYNAMIC_FORM,
        {},
      );
      return this.parseDynamicForm(formDataRaw);
    } catch (error) {
      throw error;
    }
  }
}
