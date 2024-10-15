import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import {
  GET_UNSUBSCRIBED_HOME,
  INTRO_CARDS,
} from './unsubscribed-home.queries';
import {
  GetUnsubscribedHome,
  IntroCardResRaw,
  ParsedIntroCard,
} from './unsubscribed-home.interface';
import { generateId, getImageUrl } from 'src/common/utils/helper.utils';
import { ParsedUnsubscribedHome } from 'src/modules/weekly-insights/weekly-insights.interface';

@Injectable()
export class UnsubscribedHomeService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseUnsubscribedHome(
    rawData: GetUnsubscribedHome,
  ): ParsedUnsubscribedHome {
    const attributes = rawData.unsubscribedHome?.data?.attributes;

    if (!attributes)
      throw new HttpException('No Data Available', HttpStatus.BAD_REQUEST);

    return {
      // personalisedNotes: {
      //   heading: attributes.unsubNotes?.heading,
      //   notes:
      //     attributes.unsubNotes?.noteGifs?.data?.map((note) => {
      //       return {
      //         id: generateId(),
      //         imageUrl: getImageUrl(note.attributes.url),
      //       };
      //     }) ?? [],
      // },
      pregnancyCoachPromo: attributes.pregnancyCoachPromo.map((promo) => ({
        id: generateId(),
        header: promo.header,
        btnText: promo.btnText,
        image: getImageUrl(promo.image.data?.attributes.url),
        title: promo.title,
        content: promo.content,
      })),
      // pregnancyCoachAd: {
      //   image: getImageUrl(
      //     attributes.pregnancyCoachAd?.image?.data?.attributes.url,
      //   ),
      //   title: attributes.pregnancyCoachAd?.title,
      //   bgColor: attributes.pregnancyCoachAd?.bgColor,
      //   btnText: attributes.pregnancyCoachAd?.btnText,
      //   btnBgColor: attributes.pregnancyCoachAd?.btnBgColor,
      // },
      dietPlanPromo: attributes.dietPlanPromo.map((promo) => ({
        id: generateId(),
        image: getImageUrl(promo.image.data?.attributes.url),
        title: promo.title,
        content: promo.content,
        getMhSubBtn: {
          btnText: promo.getMhSubBtn.btnText,
          bgColor: promo.getMhSubBtn.bgColor,
        },
        dietPromoBtn: {
          btnText: promo.dietPromoBtn.btnText,
          bgColor: promo.dietPromoBtn.bgColor,
        },
      })),
      dietPlanAd: {
        text: attributes.dietPlanAd.text,
        bgImage: getImageUrl(
          attributes.dietPlanAd.bgImage?.data?.attributes.url,
        ),
        animationText: attributes.dietPlanAd.animationText,
      },
      promoVideos: attributes.promoVideos.data.map((video) =>
        getImageUrl(video.attributes.url),
      ),
      symptoms: {
        heading: attributes.unsubSymptom.heading,
        description: attributes.unsubSymptom.description,
        image: getImageUrl(
          attributes.unsubSymptom.image?.data?.attributes?.url,
        ),
        cards: attributes.unsubSymptom.symptomCard.map((card) => {
          return {
            id: card.id,
            imageUrl: getImageUrl(card.image?.data?.attributes?.url),
            title: card.title,
          };
        }),
      },
    };
  }

  async fetchUnsubscribedHome() {
    try {
      const rawData: GetUnsubscribedHome = await this.graphqlClient.query(
        GET_UNSUBSCRIBED_HOME,
        {},
      );
      return this.parseUnsubscribedHome(rawData);
    } catch (error) {
      throw error;
    }
  }

  private parseIntroCards(rawData: IntroCardResRaw): ParsedIntroCard[] {
    const data = rawData?.introCard?.data?.attributes?.cards;

    if (!data || !data.length) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    return data.map((card) => {
      return {
        id: card.id,
        header: card.header,
        subHeader: card.subHeader,
        image: getImageUrl(card?.image?.data?.attributes?.url),
      };
    });
  }

  async fetchIntroCards() {
    try {
      const rawData: IntroCardResRaw = await this.graphqlClient.query(
        INTRO_CARDS,
        {},
      );

      return this.parseIntroCards(rawData);
    } catch (error) {
      throw error;
    }
  }
}
