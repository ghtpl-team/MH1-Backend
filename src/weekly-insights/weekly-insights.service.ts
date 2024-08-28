import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import {
  CartType,
  GenericTitleImageColor,
  GenericTitleWithTitleColorList,
  InsightType,
  WeeklyInsightAttributes,
  WeeklyInsightResponseRaw,
} from './weekly-insights.interface';
import { GET_WEEKLY_INSIGHTS } from './weekly-insights.queries';

@Injectable()
export class WeeklyInsightsService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseWeeklyInsights(rawData: WeeklyInsightAttributes) {
    const { weekNumber, insightType, approvedBy, babyGrowthInsight, cards } =
      rawData;
    console.log(approvedBy);

    const parsedData = {
      weekNumber,
      insightType,
      approvedBy: {
        hmsDoctorId: approvedBy.data?.attributes?.hmsDoctorId,
        experienceYears: approvedBy.data?.attributes?.experienceYears,
        name: approvedBy.data?.attributes?.name,
        specialty: {
          name: approvedBy?.data?.attributes?.specialty?.data?.attributes?.name,
          imageUrl:
            approvedBy?.data?.attributes?.specialty?.data?.attributes?.image
              ?.data?.attributes?.url ?? null,
        },
        docImage: approvedBy?.data?.attributes?.image?.data?.attributes?.url,
      },
      babyGrowthInsight:
        insightType === InsightType.BABY
          ? {
              length: {
                color: babyGrowthInsight?.data?.attributes?.length?.color,
                description: babyGrowthInsight?.data?.attributes?.length?.desc,
                image:
                  babyGrowthInsight?.data?.attributes?.length?.image?.data
                    ?.attributes?.url,
                title: babyGrowthInsight?.data?.attributes?.length?.title,
              },
              size: {
                color: babyGrowthInsight?.data?.attributes?.size?.color,
                description: babyGrowthInsight?.data?.attributes?.size?.desc,
                image:
                  babyGrowthInsight?.data?.attributes?.size?.image?.data
                    ?.attributes?.url,
                title: babyGrowthInsight?.data?.attributes?.size?.title,
              },
              weight: {
                color: babyGrowthInsight?.data?.attributes?.weight?.color,
                description: babyGrowthInsight?.data?.attributes?.weight?.desc,
                image:
                  babyGrowthInsight?.data?.attributes?.weight?.image?.data
                    ?.attributes?.url,
                title: babyGrowthInsight?.data?.attributes?.weight?.title,
              },
            }
          : null,
      cards: cards.map(
        (
          card: Partial<
            GenericTitleWithTitleColorList & GenericTitleImageColor
          >,
        ) => {
          const parsedCard: any = {
            type: card?.image?.data
              ? CartType.TITLE_IMAGE
              : CartType.TITLE_COLOR_LIST,
            id: card.id,
            title: card.title,
          };

          if (parsedCard.type === CartType.TITLE_IMAGE) {
            parsedCard.imageUrl = card.image?.data?.attributes?.url;
          } else {
            parsedCard.titleColorList = card.titleColorList.map(
              (titleColor: any) => {
                return {
                  title: titleColor.title,
                  color: titleColor.color,
                };
              },
            );
          }
          return parsedCard;
        },
      ),
    };

    return parsedData;
  }

  async fetch(weekNumber: number, insightType: InsightType): Promise<any> {
    try {
      const rawData: WeeklyInsightResponseRaw = await this.graphqlClient.query(
        GET_WEEKLY_INSIGHTS,
        {
          weekNumber,
          insightType,
        },
      );

      const { data } = rawData.weeklyInsights;

      if (data && data.length) {
        const parsedWeeklyInsights = this.parseWeeklyInsights(
          data[0].attributes,
        );
        return parsedWeeklyInsights;
      } else {
        throw new HttpException(
          'No insights for given week',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
