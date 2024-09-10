import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { LEARN_MORE } from './diet-plans.query';
import { getImageUrl } from 'src/common/utils/helper.utils';
import {
  GetLearnMoreRaw,
  GetGenericTitleWithTitleColorListCard,
  GetGenericTitleImageColorCard,
  ParsedGenericTitleWithTitleColorListCard,
  ParsedGenericTitleImageColorCard,
  ParsedDoctor,
} from './diet-plans.interface';

@Injectable()
export class DietPlansService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

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
        imageUrl: getImageUrl(info?.image?.data?.attributes?.url),
        color: info.color,
      };
    }
  }

  private parseDoctor(
    doctor: GetLearnMoreRaw['articles']['data'][0]['attributes']['hms_doctor']['data']['attributes'],
  ): ParsedDoctor {
    return {
      name: doctor.name,
      imageUrl: getImageUrl(doctor.image.data.attributes.url),
      experienceYears: doctor.experienceYears,
      specialty: doctor.specialty.data.attributes.name,
    };
  }

  async learnMoreData() {
    const rawData = await this.graphqlClient.query(LEARN_MORE, {});
    return this.parsedLearnMoreData(rawData);
  }
}
