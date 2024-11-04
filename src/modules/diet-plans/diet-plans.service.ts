import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { DIET_PLAN, INTRO_CARDS, LEARN_MORE } from './diet-plans.query';
import { generateId, getImageUrl } from 'src/common/utils/helper.utils';
import {
  GetLearnMoreRaw,
  GetGenericTitleWithTitleColorListCard,
  GetGenericTitleImageColorCard,
  ParsedGenericTitleWithTitleColorListCard,
  ParsedGenericTitleImageColorCard,
  ParsedDoctor,
  DietIntroRaw,
  ParsedIntroStory,
  ParsedDietIntroStories,
  DietChartsRawResponse,
  DietType,
} from './diet-plans.interface';
import { DietPlanInfoFormDto } from './dto/diet-plan.dto';
import { EntityManager } from '@mikro-orm/mysql';
import {
  BloodSugarLevel,
  BloodSugarLevel1,
  BloodSugarLevel2,
  MedicalCondition,
  MedicalRecord,
  PregnancyComplications,
} from 'src/entities/medical-records.entity';
import { UserProfile } from 'src/entities/user-profile.entity';
import { UserPreferences } from 'src/entities/user-preferences.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  DietCardColor,
  DietCardTabIcons,
  DietDoctorDetails,
} from 'src/constants/diet-plan.constants';
import { Status } from 'src/entities/base.entity';
import { processTimeStatus } from 'src/common/utils/date-time.utils';
import { SYSTEM_SETTING } from 'src/configs/system.config';
import { DayjsService } from 'src/utils/dayjs/dayjs.service';
import { MoEngageService } from 'src/utils/moengage/moengage.service';
import { DietChartStatus } from 'src/common/interfaces/common.interface';

@Injectable()
export class DietPlansService {
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
    private readonly dayjsService: DayjsService,
    private readonly moEngageService: MoEngageService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  private readonly logger = new Logger(DietPlansService.name);

  private parsedLearnMoreData(rawData: GetLearnMoreRaw) {
    const data = rawData?.articles?.data[0];
    return {
      info: data.attributes.info.map((card) => this.parseInfo(card)),
      doctor: this.parseDoctor(data.attributes.hms_doctor.data.attributes),
    };
  }

  private parseInfo(
    info: GetGenericTitleWithTitleColorListCard | GetGenericTitleImageColorCard,
  ):
    | ParsedGenericTitleWithTitleColorListCard
    | ParsedGenericTitleImageColorCard {
    if ('titleColorList' in info) {
      return {
        id: info.id,
        title: info.title,
        titleColorList: info.titleColorList,
      };
    } else {
      return {
        id: info.id,
        title: info.title,
        imageUrl: getImageUrl(info?.image?.data[0]?.attributes?.url),
        color: info.color,
      };
    }
  }

  private parseDoctor(
    doctor: GetLearnMoreRaw['articles']['data'][0]['attributes']['hms_doctor']['data']['attributes'],
  ): ParsedDoctor {
    return {
      name: doctor.name,
      imageUrl: getImageUrl(doctor.imageUrl, false),
      experienceYears: doctor.experienceYears,
      specialty: doctor.specialty.data.attributes.name,
    };
  }

  async learnMoreData() {
    const rawData = await this.graphqlClient.query(LEARN_MORE, {});
    return this.parsedLearnMoreData(rawData);
  }

  private parseIntroStories(rawData: DietIntroRaw): ParsedDietIntroStories {
    try {
      const data = rawData.dietIntros.data;
      if (!data || !data.length)
        throw new HttpException('No Data Available', HttpStatus.NOT_FOUND);
      const cards: ParsedIntroStory[] = [];

      const firstCardRaw =
        data[0].attributes.dietIntroStory.data.attributes.firstCard;
      const middleCardsRaw =
        data[0].attributes.dietIntroStory.data.attributes.cards;
      const calorieCardRaw = data[0].attributes.calorieCard;
      const nutrientsCardRaw = data[0].attributes.nutrients;

      cards.push({
        id: generateId(),
        description: firstCardRaw.description,
        title: firstCardRaw.title,
        docInfo: {
          name: firstCardRaw.docInfo?.data?.attributes?.name,
          experienceYears:
            firstCardRaw.docInfo?.data?.attributes?.experienceYears,
          imageUrl: getImageUrl(
            firstCardRaw.docInfo?.data?.attributes?.imageUrl,
            false,
          ),
          specialty:
            firstCardRaw?.docInfo?.data?.attributes?.specialty?.data?.attributes
              ?.name,
        },
        imageUrl: getImageUrl(firstCardRaw.cardImage.data.attributes.url),
        footerText: firstCardRaw.footerText,
      });

      for (const middleCard of middleCardsRaw) {
        cards.push({
          description: middleCard.description,
          id: generateId(),
          title: middleCard.title,
          bgColor: middleCard.bgColor,
          images: middleCard.image.data.map((img) => {
            return { url: getImageUrl(img.attributes.url) };
          }),
          footerText: middleCard.footerText,
        });
      }

      cards.push({
        description: calorieCardRaw.description,
        id: generateId(),
        title: calorieCardRaw.title,
        bgImageUrl: getImageUrl(calorieCardRaw.bgImage.data.attributes.url),
        footerText: calorieCardRaw.footerText,
        imageUrl: getImageUrl(calorieCardRaw.image?.data?.attributes?.url),
      });

      cards.push({
        description: nutrientsCardRaw.description,
        id: generateId(),
        title: nutrientsCardRaw.title,
        imageUrl: getImageUrl(nutrientsCardRaw.image.data.attributes.url),
        footerText: nutrientsCardRaw.footerText,
      });
      return {
        trimester: parseInt(data[0].attributes.trimester),
        cards,
      };
    } catch (error) {
      this.logger.debug('cant parse diet intro stories', error.stack || error);
      throw error;
    }
  }

  async introStories(trimester: number): Promise<ParsedDietIntroStories> {
    try {
      const rawData: DietIntroRaw = await this.graphqlClient.query(
        INTRO_CARDS,
        {
          trimester: trimester,
        },
      );

      return this.parseIntroStories(rawData);
    } catch (error) {
      this.logger.error(
        'unable to fetch diet intro stories',
        error.stack || error,
      );
      throw error;
    }
  }

  async submitForm(userId: number, formData: DietPlanInfoFormDto) {
    try {
      const fork = this.em.fork();
      await fork.transactional(async (em) => {
        const medicalRecord = em.create(MedicalRecord, {
          user: userId,
          ...formData,
          medicalCondition: formData.medicalCondition,
          pregnancyComplications: formData.pregnancyComplications,
          afterFastBloodSugar: formData.afterFastBloodSugarLevel,
          afterMealBloodSugar1: formData.afterMealBloodSugarLevel,
          afterMealBloodSugar2: formData.afterMealBloodSugarLevel2,
        });

        const userProfile = em.create(UserProfile, {
          user: userId,
          ...formData,
          activityLevel: formData.physicalActivity,
        });

        const userPreferences = await em.nativeUpdate(
          UserPreferences,
          { user: userId },
          {
            ...(formData?.dietPreference && {
              dietPreference: formData.dietPreference,
            }),
            ...(formData?.foodAllergies && {
              allergies: formData.foodAllergies,
            }),
            ...(formData?.avoidedIngredients && {
              avoidedFoods: formData.avoidedIngredients,
            }),
          },
        );

        this.logger.debug(
          `User Preferences updated for user ${userId}: ${JSON.stringify(userPreferences)}`,
        );

        await em.persistAndFlush([medicalRecord, userProfile]);
      });

      await this.cacheService.set(`diet-plan-form-${userId}`, true, 0);

      return {
        success: true,
        message: 'Form submitted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  private assignBgColor(index: number) {
    try {
      switch (index) {
        case 6:
          return DietCardColor['Pale Yellow'];
        case 5:
          return DietCardColor['Pale Green'];
        case 4:
          return DietCardColor['Pale Blue'];
        case 3:
          return DietCardColor['Pale Red'];
        case 2:
          return DietCardColor['Pale Purple'];
        case 1:
          return DietCardColor['Pale Yellow'];
        default:
          return DietCardColor['Pale Pink'];
      }
    } catch (error) {
      this.logger.error('unable to assign bg color', error.stack || error);
      throw error;
    }
  }

  private isDefaultTab(mealTiming: string): boolean {
    try {
      const currentHour = this.dayjsService.getCurrentHour();

      switch (mealTiming.toLowerCase()) {
        case 'breakfast':
          return currentHour >= 6 && currentHour < 10;
        case 'mid_morning_snack':
          return currentHour >= 10 && currentHour < 12;
        case 'lunch':
          return currentHour >= 12 && currentHour < 15;
        case 'afternoon_snack':
          return currentHour >= 15 && currentHour < 18;
        case 'dinner':
          return currentHour >= 18 && currentHour < 22;
        default:
          return false;
      }
    } catch (error) {
      this.logger.error('Unable to check if default tab', error.stack || error);
      throw error;
    }
  }

  private parseDietPlan(rawData: DietChartsRawResponse) {
    try {
      const data = rawData.dietCharts.data[0]?.attributes;
      const dietPlanRaw = data.dietPlan;
      const weekNumber = data.week;

      const dietPlan = dietPlanRaw.map((meal) => {
        return {
          id: meal.id,
          tabIcon: DietCardTabIcons[meal.mealTiming],
          mealTiming: meal.mealTiming.replaceAll('_', ' '),
          isActive: this.isDefaultTab(meal.mealTiming),
          mealPlan: meal.recipes.data.map((recipe, index) => {
            return {
              bgColor: this.assignBgColor(index),
              id: recipe.id,
              name: recipe.attributes.name,
              imageUrl: getImageUrl(
                recipe.attributes.image.data.attributes.url,
              ),
              contains: recipe.attributes?.contains ?? [],
              notSuitableFor: recipe.attributes.notSuitableFor ?? [],
              ingredients: recipe.attributes.ingredients,
              method: recipe.attributes.method,
              videoUrl: recipe.attributes.videoUrl,
              label: recipe.attributes.label.map((label) => {
                return {
                  name: label?.text ?? '',
                  bgColor: label.backgroundColor,
                };
              }),
            };
          }),
        };
      });

      return {
        doctorInfo: {
          name: DietDoctorDetails.name,
          imageUrl: DietDoctorDetails.imageUrl,
          experienceYears: DietDoctorDetails.experienceYears,
          specialty: DietDoctorDetails.specialty,
        },
        weekNumber,
        dietPlan,
      };
    } catch (error) {
      this.logger.error('unable to parse diet plan', error.stack || error);
      throw error;
    }
  }

  private canShowDietChart(
    userMedicalHistory: MedicalRecord,
    userPreferences: UserPreferences,
  ) {
    try {
      const hasMultipleConditions =
        userMedicalHistory.medicalCondition.length >= 2 ||
        userMedicalHistory.pregnancyComplications.length >= 2 ||
        userPreferences.allergies.length >= 2;

      const hasWeightIssues = userMedicalHistory.medicalCondition.includes(
        MedicalCondition.OBESITY,
      );

      const hasDiabetesWithInsulin =
        userMedicalHistory.medicalCondition.includes(
          MedicalCondition.DIABETES,
        ) && userMedicalHistory.onInsulin;

      const hasGDMWithAbnormalBloodSugar =
        userMedicalHistory.pregnancyComplications.includes(
          PregnancyComplications.GDM,
        ) && userMedicalHistory.afterFastBloodSugar !== BloodSugarLevel.NORMAL;

      const hasAbnormalBloodSugar =
        userMedicalHistory.afterMealBloodSugar1 !== BloodSugarLevel1.NORMAL ||
        userMedicalHistory.afterMealBloodSugar2 !== BloodSugarLevel2.NORMAL;

      const hasObesityWithGDM =
        userMedicalHistory.medicalCondition.includes(
          MedicalCondition.OBESITY,
        ) &&
        userMedicalHistory.pregnancyComplications.includes(
          PregnancyComplications.GDM,
        );

      console.log(
        'diet chart info',
        hasMultipleConditions,
        hasWeightIssues,
        hasDiabetesWithInsulin,
        hasGDMWithAbnormalBloodSugar,
        hasAbnormalBloodSugar,
        hasObesityWithGDM,
      );

      if (
        hasMultipleConditions ||
        hasWeightIssues ||
        hasDiabetesWithInsulin ||
        hasGDMWithAbnormalBloodSugar ||
        hasAbnormalBloodSugar ||
        hasObesityWithGDM
      )
        return false;

      return true;
    } catch (error) {
      this.logger.debug(
        'unable to check if user can show diet chart',
        error.stack || error,
      );
      return false;
    }
  }

  async fetchDietPlan(
    userId: number,
    weekNumber: number,
    internalRequest: boolean = false,
  ) {
    try {
      const userMedicalHistory = await this.em.findOne(MedicalRecord, {
        user: userId,
        status: Status.ACTIVE,
      });

      const userPreferences = await this.em.findOne(
        UserPreferences,
        {
          user: userId,
          status: Status.ACTIVE,
        },
        {
          populate: [
            'allergies',
            'avoidedFoods',
            'id',
            'dietPreference',
            'user.mongoId',
          ],
        },
      );

      if (!userMedicalHistory) {
        try {
          await this.moEngageService.updateUserAttributes(
            userPreferences.user.mongoId,
            {
              AUTO_DIET_CHART_READY: DietChartStatus.AWAITING_INPUT,
            },
          );
        } catch (error) {
          this.logger.error(
            'Failed to update user attribute of diet status on moengage',
          );
        }

        return {
          success: false,
          isMedicalHistoryFilled: false,
          isDietPlanCreated: false,
          message: 'Please fill medical history',
        };
      }

      if (!this.canShowDietChart(userMedicalHistory, userPreferences)) {
        if (internalRequest) {
          return {
            isSent: false,
            isReviewed: false,
            isMedicalHistoryFilled: true,
            isDietPlanCreated: false,
          };
        }

        try {
          await this.moEngageService.updateUserAttributes(
            userPreferences.user.mongoId,
            {
              AUTO_DIET_CHART_READY: DietChartStatus.REJECTED,
            },
          );
        } catch (error) {
          this.logger.error(
            'Failed to update user attribute of diet status on moengage',
          );
        }

        return {
          success: false,
          isMedicalHistoryFilled: true,
          isDietPlanCreated: false,
          doctorInfo: {
            name: DietDoctorDetails.name,
            imageUrl: DietDoctorDetails.imageUrl,
            experienceYears: DietDoctorDetails.experienceYears,
            specialty: DietDoctorDetails.specialty,
          },
          message: 'consult doctor',
        };
      }

      const pregnancyComplications = userMedicalHistory.pregnancyComplications;
      const medicalCondition = userMedicalHistory.medicalCondition;

      let dietType = DietType.NORMAL;

      if (medicalCondition.includes(MedicalCondition.OVERWEIGHT)) {
        dietType = DietType.OVERWEIGHT;
        weekNumber = weekNumber % 8;
        if (weekNumber === 0) weekNumber = 8;
      } else if (pregnancyComplications.includes(PregnancyComplications.GDM)) {
        dietType = DietType.GDM;
      } else {
        weekNumber = Math.max(weekNumber, 5);
      }

      const dietPlanRaw: DietChartsRawResponse = await this.graphqlClient.query(
        DIET_PLAN,
        {
          weekNumber: weekNumber,
          dietType: dietType,
        },
      );

      const formSubmitTime = userMedicalHistory.updatedAt;

      const [isSentCountdown, isSent] = processTimeStatus(
        formSubmitTime,
        SYSTEM_SETTING.dietReviewTime1,
        true,
      ) as any[];

      const [reviewCountdown, isReviewed] = processTimeStatus(
        formSubmitTime,
        SYSTEM_SETTING.dietReviewTime2,
        true,
      ) as any;

      if (internalRequest) {
        return {
          isSent,
          isReviewed,
          reviewCountdown,
          isSentCountdown,
          isMedicalHistoryFilled: true,
          isDietPlanCreated: true,
        };
      }

      if (!isReviewed) {
        try {
          await this.moEngageService.updateUserAttributes(
            userPreferences.user.mongoId,
            {
              AUTO_DIET_CHART_READY: DietChartStatus.PREPARING,
            },
          );
        } catch (error) {
          this.logger.error(
            'Failed to update user attribute of diet status on moengage',
          );
        }
      }

      const parsedDietPlan = this.parseDietPlan(dietPlanRaw);

      return {
        success: true,
        isSent,
        isReviewed,
        reviewCountdown,
        isSentCountdown,
        isMedicalHistoryFilled: true,
        isDietPlanCreated: true,
        ...parsedDietPlan,
      };
    } catch (error) {
      this.logger.error('unable to fetch diet plan', error.stack || error);
      throw error;
    }
  }
}
