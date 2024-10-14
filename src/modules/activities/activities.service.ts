import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import {
  ACTIVITY_HISTORY,
  FEEDBACK_FORM,
  FITNESS_ACTIVITIES,
  MIND_ACTIVITIES,
  PREGNANCY_COACH,
} from './activities.query';
import {
  ActivityHistoryRaw,
  Button,
  ConsentForm,
  Doctor,
  FeedbackFormData,
  FitnessActivitiesRaw,
  GetPregnancyCoachRaw,
  MindActivitiesOverview,
  MindActivitiesRaw,
  ParsedActivityHistory,
  ParsedConsentForm,
  ParsedDoctor,
  ParsedFeedbackForm,
  ParsedFitnessActivity,
} from './activities.interface';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { pregnancyCoachOverview } from 'src/common/content/activity.content';
import { EntityManager } from '@mikro-orm/mysql';

import { FeedbackFromDto } from './dto/activities.dto';
import { Status } from 'src/entities/base.entity';
import { ActivityFeedBack } from 'src/entities/activity-feedback.entity';
import {
  ScheduledTask,
  ScheduledTaskStatus,
} from 'src/entities/scheduled-tasks.entity';
import { ReminderType } from 'src/entities/schedules.entity';
import { UserPreferences } from 'src/entities/user-preferences.entity';
import { UserConsent } from 'src/entities/user-consent.entity';
import { formatDateFromDateTime } from 'src/common/utils/date-time.utils';
import { RewardPointsEarnedType } from 'src/entities/reward-point-aggregation.entity';
import { RewardPointsService } from '../reward-points/reward-points.service';
import { SYSTEM_SETTING } from 'src/configs/system.config';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
    private readonly rewardPointService: RewardPointsService,
  ) {}

  private parseMindActivities(
    rawData: MindActivitiesRaw,
  ): MindActivitiesOverview {
    try {
      const { heading, subHeading, mind_activities } =
        rawData.mindActivitiesOverview.data.attributes;

      const parsedData: MindActivitiesOverview = {
        heading: heading || '',
        subHeading: subHeading || '',
        mindActivities: mind_activities.data.map((activity) => {
          const videos = activity.attributes.videos.data.map((video) => {
            return (
              getImageUrl(video?.attributes?.videoUrl?.data?.attributes?.url) ??
              ''
            );
          });
          return {
            name: activity.attributes.name || '',
            duration: activity.attributes.duration || '',
            benefits: activity.attributes.benefits || '',
            thumbnail: getImageUrl(
              activity.attributes.thumbnail?.data?.attributes?.url,
            ),
            imageUrl: getImageUrl(
              activity.attributes.imageUrl?.data?.attributes?.url,
            ),
            thumbnailUrl: getImageUrl(
              activity.attributes.thumbnailUrl?.data?.attributes?.url,
            ),
            description: activity.attributes.description || '',
            videoUrl: videos && videos.length ? videos[0] : '',
          };
        }),
      };
      return parsedData;
    } catch (error) {
      this.logger.error(
        "Can't parse mind activity data.",
        error.stack || error,
      );
      throw error;
    }
  }

  async fetchMindActivities(weekNumber: number) {
    try {
      const mindActivitiesRaw: MindActivitiesRaw =
        await this.graphqlClient.query(MIND_ACTIVITIES, {
          weekNumber: weekNumber,
        });

      const parsedMindActivityOverview: MindActivitiesOverview =
        this.parseMindActivities(mindActivitiesRaw);
      return parsedMindActivityOverview;
    } catch (error) {
      this.logger.error(
        'unable to fetch data from strapi',
        error.stack || error,
      );
      throw error;
    }
  }

  private parseFitnessActivities(
    response: FitnessActivitiesRaw,
    showConsentForm: boolean,
  ): {
    activities: ParsedFitnessActivity[];
    consentForm: ParsedConsentForm;
    showConsentForm: boolean;
  } {
    let consentForm;
    const activities = response.fitnessActivities?.data
      ?.map((item) => {
        const attrs = item?.attributes;
        if (!attrs) return null;
        consentForm = this.parseConsentForm(
          attrs.consent_form?.data?.attributes,
        );
        return {
          week: attrs.week ?? 0,
          name: attrs.name ?? '',
          videoUrl: getImageUrl(attrs.videoUrl?.data?.attributes?.url) ?? '',
          thumbnailUrl: getImageUrl(attrs.thumbnail?.data?.attributes?.url),
          subHeading: attrs.subHeading ?? '',
          duration: attrs?.duration ?? 10,
          description: {
            benefits: attrs.description?.benefits ?? '',
            precautions: attrs.description?.precautions ?? '',
          },
          notSuitableFor: attrs?.notSuitableFor ?? [],
        };
      })
      .filter(
        (activity): activity is NonNullable<typeof activity> =>
          activity !== null,
      );
    return {
      activities:
        activities.sort(
          (activity1, activity2) => activity1.week - activity2.week,
        ) ?? [],
      showConsentForm,
      consentForm,
    };
  }

  private parseConsentForm(consentForm?: ConsentForm): ParsedConsentForm {
    try {
      return {
        weekConfirmation: {
          heading: consentForm?.weekConfirmation?.heading ?? '',
          subHeading1: consentForm?.weekConfirmation?.subHeading1 ?? '',
          subHeading2: consentForm?.weekConfirmation?.subHeading2 ?? '',
          button: this.parseButton(consentForm?.weekConfirmation?.button),
        },
        docInfo: {
          heading: consentForm?.docInfo?.heading ?? '',
          subHeading: consentForm?.docInfo?.subHeading ?? '',
          doctor: this.parseDoctorInfo(
            consentForm?.docInfo?.hms_doctor?.data?.attributes,
          ),
          button: this.parseButton(consentForm?.docInfo?.button),
        },
        consentForm: {
          heading: consentForm?.consentForm?.heading ?? '',
          subHeading: consentForm?.consentForm?.subHeading ?? '',
          consentText: consentForm?.consentForm?.consentText ?? '',
          button: this.parseButton(consentForm?.consentForm?.button),
        },
        disclaimer:
          consentForm?.disclaimer?.map((disclaimer: any) => {
            return {
              heading: disclaimer?.heading ?? '',
              heading2: disclaimer?.heading2 ?? '',
              subHeading: disclaimer?.subHeading ?? '',
              button: this.parseButton(disclaimer?.button),
            };
          }) ?? [],
        unlockActivityCard: {
          heading: consentForm?.unlockActivityCard?.heading ?? '',
          subHeading: consentForm?.unlockActivityCard?.subHeading ?? '',
          button: this.parseButton(consentForm?.unlockActivityCard?.button),
        },
      };
    } catch (error) {
      this.logger.error(
        'Error occurred while paring consent form',
        error.stack || error,
      );
    }
  }

  private parseDoctorInfo(doctor?: Doctor): ParsedDoctor {
    return {
      name: doctor?.name ?? 'Dr. Nidhi Chada',
      imageUrl: getImageUrl(doctor?.image?.data?.attributes?.url),
      specialty: doctor?.specialty?.data?.attributes?.name ?? 'Nephrologist',
      experienceYears: doctor?.experienceYears ?? 10,
    };
  }

  private parseButton(button?: Button) {
    return {
      btnText: button?.btnText ?? '',
      bgColor: button?.bgColor ?? '',
      textColor: button?.textColor ?? '',
    };
  }

  private async isConsentFormAcknowledged(userId: number) {
    try {
      const consentFormStatus = await this.em.findOne(UserConsent, {
        user: userId,
        lastAcknowledgedAt: {
          $ne: null,
          $eq: formatDateFromDateTime(new Date()),
        },
      });

      if (consentFormStatus) return false;
      return true;
    } catch (error) {
      this.logger.error(
        'Error occurred while updating consent form acknowledgement',
        error.stack || error,
      );
      return true;
    }
  }

  async fetchFitnessActivities(weekNumber: number, userId: number) {
    try {
      const fitnessActivityRaw: FitnessActivitiesRaw =
        await this.graphqlClient.query(FITNESS_ACTIVITIES, {
          weekNumber: weekNumber,
        });

      const showConsentForm = await this.isConsentFormAcknowledged(userId);

      return this.parseFitnessActivities(fitnessActivityRaw, showConsentForm);
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching fitness activities data',
        error.stack || error,
      );
      throw error;
    }
  }

  async acknowledgeConsentForm(userId: number) {
    try {
      this.em.upsert(UserConsent, {
        user: userId,
        lastAcknowledgedAt: formatDateFromDateTime(new Date()),
      });
      this.em.flush();
      return 'Acknowledged Successfully';
    } catch (error) {
      this.logger.error(
        'Error occurred while updating consent form acknowledgement',
        error.stack || error,
      );
      return 'Failed to acknowledge consent form';
    }
  }

  private findStatusByType(
    activityHistory: Partial<ScheduledTask>[],
    type: ReminderType,
  ) {
    const data = activityHistory.find((history) => history.type === type);
    if (!data)
      return {
        taskId: null,
        scheduleId: null,
        taskStatus: ScheduledTaskStatus.NOT_SCHEDULED,
      };
    return {
      taskId: data.id,
      scheduleId: data.schedule.id,
      taskStatus: data.taskStatus,
    };
  }

  private parsePregnancyCoachData(
    coachDataRaw: GetPregnancyCoachRaw,
    activityHistory: Partial<ScheduledTask>[],
  ) {
    const ParsedDoctor = this.parseDoctorInfo(
      coachDataRaw.activities.data[0]?.attributes?.hms_doctor?.data?.attributes,
    );

    const data = coachDataRaw.activities.data[0]?.attributes;
    const staticContent = pregnancyCoachOverview();

    const soulActivityCard = data.activityCardDynamic.filter((activity) => {
      return activity.activityType === 'Soul';
    });

    const parsedSoulActivity = {
      label: {
        text: soulActivityCard[0]?.label?.text,
        bgColor: soulActivityCard[0]?.label?.backgroundColor,
      },
      isJournalRelated: data.journalRelated ? true : false,
      type: ReminderType.SOUL_REMINDER,
      heading: soulActivityCard[0]?.title,
      image: getImageUrl(soulActivityCard[0]?.image?.data?.attributes?.url),
    };

    const parsedActivityOverview = {
      weekNumber: data.week,
      docInfo: ParsedDoctor,
      divider: staticContent.divider,
      activities: [
        {
          ...staticContent.waterActivityCard,
          ...this.findStatusByType(
            activityHistory,
            ReminderType.WATER_REMINDER,
          ),
        },
        {
          ...staticContent.fitnessCard,
          ...this.findStatusByType(
            activityHistory,
            ReminderType.FITNESS_REMINDER,
          ),
        },
        {
          ...staticContent.nutritionCard,
          ...this.findStatusByType(activityHistory, ReminderType.DIET_REMINDER),
        },
        {
          ...staticContent.mindCard,
          ...this.findStatusByType(activityHistory, ReminderType.MIND_REMINDER),
        },
        {
          ...parsedSoulActivity,
          ...this.findStatusByType(activityHistory, ReminderType.SOUL_REMINDER),
        },
      ],
    };
    return parsedActivityOverview;
  }

  async fetchPersonalCoach(weekNumber: number, userId: number) {
    try {
      const coachDataRaw: GetPregnancyCoachRaw = await this.graphqlClient.query(
        PREGNANCY_COACH,
        {
          weekNumber: weekNumber,
        },
      );

      const activityHistory = await this.fetchActivityHistory(userId, true);

      if (!coachDataRaw.activities?.data)
        throw new HttpException('No Data Available', HttpStatus.NOT_FOUND);

      const parsedData = this.parsePregnancyCoachData(
        coachDataRaw,
        activityHistory as ScheduledTask[],
      );
      return parsedData;
    } catch (error) {
      this.logger.error(
        'Not able to fetch pregnancy/personal coach data',
        error.stack || error,
      );
      throw error;
    }
  }

  private parseFeedbackForm(rawData: FeedbackFormData): ParsedFeedbackForm {
    try {
      const attributes = rawData.feedbackForm.data.attributes;

      return {
        heading: attributes.heading,
        description: attributes.description,
        questions: attributes.questionList.map((q) => ({
          type: q.type,
          question: q.question,
          options: q.options || undefined,
        })),
        lockScreen: {
          title: attributes.lockScreen.title,
          text: attributes.lockScreen.text,
          imageUrl:
            getImageUrl(attributes.lockScreen.image.data[0]?.attributes.url) ||
            '',
          doctor: this.parseDoctorInfo(
            attributes.lockScreen.hms_doctor.data.attributes,
          ),
        },
      };
    } catch (error) {
      this.logger.error('Cant parse feedback form data', error.stack || error);
      throw error;
    }
  }

  async getFeedbackForm() {
    try {
      const feedbackFromRaw: FeedbackFormData = await this.graphqlClient.query(
        FEEDBACK_FORM,
        {},
      );

      if (!feedbackFromRaw?.feedbackForm?.data)
        throw new HttpException('No Data Available', HttpStatus.NOT_FOUND);

      const parsedData = this.parseFeedbackForm(feedbackFromRaw);
      return parsedData;
    } catch (error) {
      this.logger.error('No data for feedback form', error.stack || error);
      throw error;
    }
  }

  async recordFeedback(feedbackDto: FeedbackFromDto, userId: number) {
    try {
      const feedback = await this.em.create(ActivityFeedBack, {
        ...feedbackDto,
        user: userId,
      });
      await this.em.flush();
      if (feedback.discomfort) {
        await this.em.nativeUpdate(
          UserPreferences,
          {
            user: userId,
          },
          {
            isActivityLocked: true,
          },
        );
      }
      return 'Recorded Successfully';
    } catch (error) {
      this.logger.error(
        'Symptom logging operation failed',
        error.stack || error,
      );
      throw error;
    }
  }

  private parseActivityHistory(
    activityHistoryContent: ActivityHistoryRaw,
    activityHistory: Partial<ScheduledTask>[],
    rewardPoints: Record<'total' | RewardPointsEarnedType, number>,
  ): ParsedActivityHistory {
    const attributes =
      activityHistoryContent?.activityHistory?.data?.attributes;
    return {
      header: attributes.header,
      totalPointsEarned: rewardPoints.total,
      headerImgUrl: getImageUrl(attributes.headerImg?.data?.attributes?.url),
      pointsCards: attributes?.pointsCard?.map((card) => {
        return {
          id: card.id,
          bgImgUrl: getImageUrl(card.bgImg?.data?.attributes?.url),
          title: card.title,
          points:
            rewardPoints[
              this.convertToRewardPointsEarnedType(
                card.title.toLocaleLowerCase(),
              )
            ],
        };
      }),
      historyHeader: attributes.historyHeader,
      historyCards: activityHistory
        .map((history) => {
          const data = attributes.historyCards.find((card) => {
            return (
              card.activityType.toLocaleLowerCase() ===
              history.type.toLocaleLowerCase()
            );
          });

          if (data && history.taskStatus === ScheduledTaskStatus.DONE) {
            return {
              id: data.id,
              date: history.date,
              activityType: history.type,
              imageUrl: getImageUrl(data.image?.data?.attributes?.url),
              label: data.label,
              title: data.title,
              pointEarned:
                SYSTEM_SETTING.activityPoints[
                  this.convertToRewardPointsEarnedType(history.type)
                ],
            };
          }
        })
        .filter(Boolean),
    };
  }

  async fetchActivityHistory(userId: number, isHelper: boolean = false) {
    try {
      const activityHistory = await this.em
        .createQueryBuilder(ScheduledTask)
        .select(['date', 'id', 'type', 'taskStatus', 'schedule'])
        .where({
          date: new Date().toISOString().slice(0, 10),
          status: Status.ACTIVE,
          user: userId,
          type: {
            $in: [
              ReminderType.WATER_REMINDER,
              ReminderType.DIET_REMINDER,
              ReminderType.SOUL_REMINDER,
              ReminderType.MIND_REMINDER,
              ReminderType.FITNESS_REMINDER,
            ],
          },
        });

      const rewardPoints =
        await this.rewardPointService.getRewardPoints(userId);

      if (isHelper) return activityHistory;
      const activityHistoryContent = await this.graphqlClient.query(
        ACTIVITY_HISTORY,
        {},
      );

      return this.parseActivityHistory(
        activityHistoryContent,
        activityHistory,
        rewardPoints,
      );
    } catch (error) {
      throw error;
    }
  }

  private convertToRewardPointsEarnedType(text: string) {
    switch (text) {
      case ReminderType.WATER_REMINDER:
        return RewardPointsEarnedType.WATER_GOAL_ACHIEVED;
      case ReminderType.DIET_REMINDER:
        return RewardPointsEarnedType.NUTRITION_GOAL_ACHIEVED;
      case ReminderType.SOUL_REMINDER:
        return RewardPointsEarnedType.SOUL_GOAL_ACHIEVED;
      case ReminderType.FITNESS_REMINDER:
        return RewardPointsEarnedType.FITNESS_GOAL_ACHIEVED;
      case ReminderType.MIND_REMINDER:
        return RewardPointsEarnedType.MIND_GOAL_ACHIEVED;
      default:
        return RewardPointsEarnedType.WATER_GOAL_ACHIEVED;
    }
  }
  async updateActivityStatus(
    userId: number,
    taskId: number,
    activityType?: ReminderType,
  ) {
    try {
      const updatedStatus = await this.em
        .createQueryBuilder(ScheduledTask)
        .update({
          taskStatus: ScheduledTaskStatus.DONE,
        })
        .where({
          id: taskId,
          user: userId,
        });

      if (!updatedStatus)
        throw new HttpException('No Data Available', HttpStatus.NOT_FOUND);

      await this.em.flush();
      if (activityType) {
        this.rewardPointService.upsert(
          userId,
          this.convertToRewardPointsEarnedType(activityType),
        );
      }

      return `Task status updated for ${updatedStatus} entries`;
    } catch (error) {
      throw error;
    }
  }
}
