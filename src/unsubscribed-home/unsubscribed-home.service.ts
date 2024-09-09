import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { GET_UNSUBSCRIBED_HOME } from './unsubscribed-home.queries';
import { GetUnsubscribedHome } from './unsubscribed-home.interface';
import { generateId, getImageUrl } from 'src/common/utils/helper.utils';
import { ParsedUnsubscribedHome } from 'src/weekly-insights/weekly-insights.interface';

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
      pregnancyCoachPromo: attributes.pregnancyCoachPromo.map((promo) => ({
        id: generateId(),
        image: getImageUrl(promo.image.data?.attributes.url),
        title: promo.title,
        content: promo.content,
      })),
      pregnancyCoachAd: {
        image: getImageUrl(
          attributes.pregnancyCoachAd.image.data?.attributes.url,
        ),
        title: attributes.pregnancyCoachAd.title,
        bgColor: attributes.pregnancyCoachAd.bgColor,
        btnText: attributes.pregnancyCoachAd.btnText,
        btnBgColor: attributes.pregnancyCoachAd.btnBgColor,
      },
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
}
