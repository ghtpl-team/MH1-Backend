import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import {
  GenericTitleImageColor,
  GenericTitleWithTitleColorList,
  GetPersonalizedNotesListingResponse,
  HmsDoctorAttributes,
  InsightCardType,
  InsightType,
  ParsedCard,
  ParsedPersonalisedNotes,
  PersonalizedNotesListingAttributes,
  WeeklyInsightAttributes,
  WeeklyInsightResponseRaw,
} from './weekly-insights.interface';
import {
  GET_PERSONALIZED_CARD_LISTING,
  GET_WEEKLY_INSIGHTS,
} from './weekly-insights.queries';

@Injectable()
export class WeeklyInsightsService {
  private readonly logger = new Logger(WeeklyInsightsService.name);
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseWeeklyInsights(rawData: WeeklyInsightAttributes) {
    try {
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
            name: approvedBy?.data?.attributes?.specialty?.data?.attributes
              ?.name,
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
                  description:
                    babyGrowthInsight?.data?.attributes?.length?.desc,
                  image: getImageUrl(
                    babyGrowthInsight?.data?.attributes?.length?.image?.data
                      ?.attributes?.url,
                  ),
                  title: babyGrowthInsight?.data?.attributes?.length?.title,
                },
                size: {
                  color: babyGrowthInsight?.data?.attributes?.size?.color,
                  description: babyGrowthInsight?.data?.attributes?.size?.desc,
                  image: getImageUrl(
                    babyGrowthInsight?.data?.attributes?.size?.image?.data
                      ?.attributes?.url,
                  ),
                  title: babyGrowthInsight?.data?.attributes?.size?.title,
                },
                weight: {
                  color: babyGrowthInsight?.data?.attributes?.weight?.color,
                  description:
                    babyGrowthInsight?.data?.attributes?.weight?.desc,
                  image: getImageUrl(
                    babyGrowthInsight?.data?.attributes?.weight?.image?.data
                      ?.attributes?.url,
                  ),
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
                card.image?.data[0].attributes?.url,
              );
              parsedCard.color = card.color;
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
    } catch (error) {
      this.logger.error('Error parsing weekly insights', error?.stack || error);
      throw error;
    }
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
      this.logger.error(
        'Error fetching weekly insights',
        error?.stack || error,
      );
      throw error;
    }
  }

  private parseNoteCards(
    rawData: {
      attributes: PersonalizedNotesListingAttributes;
    }[],
  ): ParsedPersonalisedNotes {
    try {
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
            image: getImageUrl(card.image.data.attributes.url),
            type: 'NOTE_CARD' as const,
            insightType: card.insightType,
            bgColor: card.bgColor,
            bottomBgColor: card.bgBottomColor,
          };
        }

        throw new Error(`Unknown card type: ${(card as any).__typename}`);
      });

      return {
        heading: data.heading,
        weekNumber: data.weekNumber,
        cards: parsedCards,
      };
    } catch (error) {
      this.logger.error('Error parsing note cards', error?.stack || error);
      throw error;
    }
  }

  private parseDoctorInfo(
    doctorData: HmsDoctorAttributes,
  ): ParsedCard['doctor'] {
    try {
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
    } catch (error) {
      this.logger.error('Error parsing doctor info', error?.stack || error);
      throw error;
    }
  }

  async fetchNoteCards(weekNumber: number): Promise<any> {
    try {
      const rawData: GetPersonalizedNotesListingResponse =
        await this.graphqlClient.query(GET_PERSONALIZED_CARD_LISTING, {
          weekNumber: weekNumber,
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
      this.logger.error('Error fetching note cards', error?.stack || error);
      throw error;
    }
  }
}
