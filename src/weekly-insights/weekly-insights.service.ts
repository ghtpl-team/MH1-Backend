import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import {
  InsightCardType,
  GenericTitleImageColor,
  GenericTitleWithTitleColorList,
  InsightType,
  WeeklyInsightAttributes,
  WeeklyInsightResponseRaw,
  GetPersonalizedNotesListingResponse,
  ParsedPersonalisedNotes,
  HmsDoctorAttributes,
  ParsedCard,
  PersonalizedNotesListingAttributes,
} from './weekly-insights.interface';
import {
  GET_PERSONALIZED_CARD_LISTING,
  GET_WEEKLY_INSIGHTS,
} from './weekly-insights.queries';
import { getImageUrl } from 'src/common/utils/helper.utils';

@Injectable()
export class WeeklyInsightsService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseWeeklyInsights(rawData: WeeklyInsightAttributes) {
    const { weekNumber, insightType, approvedBy, babyGrowthInsight, cards } =
      rawData;

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
            getImageUrl(
              approvedBy?.data?.attributes?.specialty?.data?.attributes?.image
                ?.data?.attributes?.url,
            ) ?? null,
        },
        docImage: getImageUrl(
          approvedBy?.data?.attributes?.image?.data?.attributes?.url,
        ),
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
              ? InsightCardType.TITLE_IMAGE
              : InsightCardType.TITLE_COLOR_LIST,
            id: card.id,
            title: card.title,
          };

          if (parsedCard.type === InsightCardType.TITLE_IMAGE) {
            parsedCard.imageUrl = getImageUrl(
              card.image?.data?.attributes?.url,
            );
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

  async fetchInsights(
    weekNumber: number,
    insightType: InsightType,
  ): Promise<any> {
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

  private parseNoteCards(
    rawData: {
      attributes: PersonalizedNotesListingAttributes;
    }[],
  ): ParsedPersonalisedNotes {
    const data = rawData[0].attributes;

    const parsedCards: ParsedCard[] = data.cards.map((card) => {
      const baseCard = {
        id: card.id,
        title: card.title,
        doctor: card.hms_doctor?.data
          ? this.parseDoctorInfo(card.hms_doctor.data.attributes)
          : null,
      };

      if (card.__typename === 'ComponentCardsTitleDocBtn') {
        return {
          ...baseCard,
          type: 'TITLE_DOC_BTN' as const,
          bgColor: card.bgColor,
          ctaButton: card.ctaButton,
        };
      } else if (card.__typename === 'ComponentCardsNoteCard') {
        return {
          ...baseCard,
          type: 'NOTE_CARD' as const,
          insightType: card.insightType,
        };
      }

      throw new Error(`Unknown card type: ${(card as any).__typename}`);
    });

    return {
      heading: data.heading,
      weekNumber: data.weekNumber,
      cards: parsedCards,
    };
  }

  private parseDoctorInfo(
    doctorData: HmsDoctorAttributes,
  ): ParsedCard['doctor'] {
    const attributes = doctorData;
    return {
      name: attributes.name,
      experienceYears: attributes.experienceYears,
      hmsDoctorId: attributes.hmsDoctorId,
      image: getImageUrl(attributes.image.data?.attributes.url) ?? null,
      specialty: {
        name: attributes.specialty.data.attributes.name,
        image:
          getImageUrl(
            attributes.specialty.data.attributes.image.data?.attributes.url,
          ) ?? null,
      },
    };
  }

  async fetchNoteCards(weekNumber: number): Promise<any> {
    try {
      const rawData: GetPersonalizedNotesListingResponse =
        await this.graphqlClient.query(GET_PERSONALIZED_CARD_LISTING, {
          weekNumber,
        });

      const { data } = rawData.personalisedNotesListings;
      if (data && data.length) {
        const parsedNoteCards = this.parseNoteCards(data);
        return parsedNoteCards;
      } else {
        throw new HttpException(
          'No cards for given week',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
