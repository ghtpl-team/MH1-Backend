import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { GetSymptomListingRaw } from './symptoms.interface';
import { GET_SYMPTOM_CATEGORIES } from './symptoms.query';
import { getImageUrl } from 'src/common/utils/helper.utils';

@Injectable()
export class SymptomsService {
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
  ) {}

  private parseSymptomListing(rawData: GetSymptomListingRaw) {
    return rawData.symptomCategories.data.map((category) => ({
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
}
