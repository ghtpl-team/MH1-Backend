import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { INTRO_CARDS, LEARN_MORE } from './diet-plans.query';
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
} from './diet-plans.interface';

@Injectable()
export class DietPlansService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

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
      imageUrl: getImageUrl(doctor.image.data.attributes.url),
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
      console.log(rawData);

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
            firstCardRaw.docInfo?.data?.attributes?.image?.data?.attributes
              ?.url,
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
}
