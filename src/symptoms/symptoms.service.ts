import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { GetSymptomListingRaw, LoggedSymptomsRaw } from './symptoms.interface';
import { GET_LOGGED_SYMPTOMS, GET_SYMPTOM_CATEGORIES } from './symptoms.query';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { LoggedSymptoms, Status } from 'src/app.entities';
import { LogSymptomsDto } from './dto/symptoms.dto';
import { formatDateFromDateTime } from 'src/common/utils/date-time.utils';

@Injectable()
export class SymptomsService {
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
  ) {}

  private parseSymptomListing(rawData: GetSymptomListingRaw) {
    return rawData.symptomCategories?.data?.map((category) => ({
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
      if (loggedSymptoms) return 'logged successfully';
      throw new HttpException(
        'Something Went Wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
          imageUrl: getImageUrl(docInfo?.image?.data?.attributes?.url) ?? '',
          specialty: docInfo?.specialty?.data?.attributes?.name ?? '',
          hmsDoctorId: docInfo?.hmsDoctorId ?? '',
        },
        description: symptomData.attributes?.description ?? '',
        symptomStories:
          symptomStories?.content?.map((card) => ({
            // rank: card.rank ?? 0,
            title: card.title ?? '',
            imageUrl: getImageUrl(card.image?.data?.attributes?.url) ?? '',
            bgColor: card.bgColor ?? '',
            description: card.description ?? '',
          })) ?? [],
      };
    });
  }

  async fetchLoggedSymptoms(userId: number) {
    try {
      const loggedSymptoms = await this.em
        .createQueryBuilder(LoggedSymptoms)
        .select(['id', 'symptoms'])
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
          },
        );
        return this.parsedLoggedSymptomData(symptomsWithStory);
      }
      return [];
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
