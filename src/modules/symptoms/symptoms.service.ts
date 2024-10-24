import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, Logger } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { GetSymptomListingRaw, LoggedSymptomsRaw } from './symptoms.interface';
import { GET_LOGGED_SYMPTOMS, GET_SYMPTOM_CATEGORIES } from './symptoms.query';
import { generateId, getImageUrl } from 'src/common/utils/helper.utils';

import { LogSymptomsDto } from './dto/symptoms.dto';
import {
  formatDateFromDateTime,
  processTimeStatus,
} from 'src/common/utils/date-time.utils';
import { Status } from 'src/entities/base.entity';
import { LoggedSymptoms } from 'src/entities/logged_symptoms';
import { SYSTEM_SETTING } from 'src/configs/system.config';

@Injectable()
export class SymptomsService {
  private readonly logger = new Logger(SymptomsService.name);

  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
  ) {}

  private parseSymptomListing(rawData: GetSymptomListingRaw) {
    return rawData.symptomCategories?.data?.map((category, index: number) => ({
      id: index,
      name: category.attributes.name,
      imageUrl: getImageUrl(category.attributes.image.data.attributes.url),
      bgColor: category.attributes.bgColor,
      symptoms: category.attributes.symptoms.data.map(
        (symptom) => symptom.attributes.name,
      ),
    }));
  }

  async fetchSymptomCategories() {
    try {
      const rawData: GetSymptomListingRaw = await this.graphqlClient.query(
        GET_SYMPTOM_CATEGORIES,
        {},
      );
      return this.parseSymptomListing(rawData);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addSymptoms(logSymptomsData: LogSymptomsDto, userId: number) {
    try {
      const loggedSymptoms = await this.em.create(LoggedSymptoms, {
        symptoms: logSymptomsData.symptoms,
        user: userId,
      });
      await this.em.flush();
      return `logged successfully, logged symptom id: ${loggedSymptoms.id}`;
    } catch (error) {
      throw error;
    }
  }

  private parsedLoggedSymptomData(rawData: LoggedSymptomsRaw) {
    return rawData.symptoms.data.map((symptomData) => {
      const symptomStories =
        symptomData.attributes?.symptom_story?.data?.attributes;

      const docInfo = symptomData.attributes?.hms_doctor?.data?.attributes;

      return {
        name: symptomData.attributes?.name ?? '',
        imageUrl:
          getImageUrl(symptomData.attributes?.image?.data?.attributes?.url) ??
          '',
        doctor: {
          name: docInfo?.name ?? '',
          imageUrl: getImageUrl(docInfo?.imageUrl, false) ?? '',
          specialty: docInfo?.specialty?.data?.attributes?.name ?? '',
          hmsDoctorId: docInfo?.hmsDoctorId ?? '',
          experienceYears: docInfo?.experienceYears ?? 0,
        },
        description: symptomData.attributes?.description ?? '',
        symptomStories:
          symptomStories?.content?.map((card) => {
            return {
              // rank: card.rank ?? 0,
              id: generateId(),
              title: card.title ?? '',
              imageUrl: getImageUrl(card.image?.data?.attributes?.url) ?? '',
              bgColor: card.bgColor ?? '',
              description: card.description ?? '',
              button: card?.buttons
                ? card.buttons.map((button) => {
                    return {
                      btnText: button.btnText ?? '',
                      bgColor: button.bgColor ?? '',
                      textColor: button.textColor ?? '',
                    };
                  })
                : undefined,
            };
          }) ?? [],
      };
    });
  }

  // private isSymptomReviewed(updatedAt: string | Date) {
  //   try {
  //     const reviewTime = SYSTEM_SETTING.symptomReviewTime;
  //     const currentTime = new Date().getTime();
  //     const updatedTime = new Date(updatedAt).getTime();
  //     return currentTime - updatedTime > reviewTime;
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  async fetchLoggedSymptoms(userId: number, page: number, limit: number) {
    try {
      const loggedSymptoms = await this.em
        .createQueryBuilder(LoggedSymptoms)
        .select(['id', 'symptoms', 'updatedAt'])
        .where({
          user: { id: userId },
          loggingDate: formatDateFromDateTime(new Date()),
          status: Status.ACTIVE,
        })
        .limit(1);

      if (loggedSymptoms && loggedSymptoms.length) {
        const symptomsWithStory = await this.graphqlClient.query(
          GET_LOGGED_SYMPTOMS,
          {
            loggedSymptoms: loggedSymptoms[0].symptoms,
            page: page,
            pageSize: limit,
          },
        );
        const [reviewCountdown, isReviewed] = processTimeStatus(
          loggedSymptoms[0].updatedAt,
          SYSTEM_SETTING.symptomReviewTime,
        ) as any;
        return {
          reviewCountdown: reviewCountdown,
          isReviewed: isReviewed,
          id: loggedSymptoms[0].id,
          pagination: {
            currentPage: page,
            currentLimit: limit,
            totalLogged: loggedSymptoms.length,
            totalPages: Math.ceil(loggedSymptoms.length / limit),
          },
          loggedSymptoms: this.parsedLoggedSymptomData(symptomsWithStory),
        };
      }
      return [];
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async updateSymptoms(updateData: LogSymptomsDto, id: number) {
    try {
      const updatedSymptoms = await this.em.nativeUpdate(
        LoggedSymptoms,
        {
          id: id,
        },
        {
          symptoms: updateData.symptoms,
        },
      );
      return {
        msg: `modified ${updatedSymptoms} entry successfully.`,
        loggedSymptoms: updateData.symptoms,
      };
    } catch (error) {
      throw error;
    }
  }
}
