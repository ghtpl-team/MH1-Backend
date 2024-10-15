import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { generateId, getImageUrl } from 'src/common/utils/helper.utils';
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
import { ConfigService } from '@nestjs/config';
import { PersonalisedCardColor } from 'src/constants/personalized-nots.constants';

@Injectable()
export class WeeklyInsightsService {
  private readonly logger = new Logger(WeeklyInsightsService.name);
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly configService: ConfigService,
  ) {}

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
          docImage: getImageUrl(approvedBy?.data?.attributes?.imageUrl, false),
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
      const scanCard =
        rawData[0].attributes.weeklyScanCard?.data?.attributes?.scanDetails;
      const counselingCard =
        rawData[0].attributes?.counselingCard?.data?.attributes?.counselingCard;

      const msgCount = [1, 3, 7];
      const parsedCards: ParsedCard[] = [];
      [scanCard, counselingCard].forEach((card, index) => {
        if (card) {
          parsedCards.push({
            id: generateId(),
            title: card.title,
            image: getImageUrl(card.image.data.attributes.url),
            type: 'TITLE_DOC_BTN' as const,
            ctaButton: card.button,
            chatUrl: this.configService.get('HP_SUPPORT_CHAT_URL'),
            bgColor: index
              ? PersonalisedCardColor['Session Card']
              : PersonalisedCardColor['Scan Card'],
          });
        }
      });

      data.cards.forEach((card, index) => {
        const { bgColor, bottomBgColor } = this.getCardColor(
          card.insightType as any,
        );
        const baseCard = {
          id: card.id,
          title: card.title,
          doctor: card.hms_doctor?.data
            ? this.parseDoctorInfo(card.hms_doctor.data.attributes)
            : null,
          image: getImageUrl(card.image.data.attributes.url),
          type: 'NOTE_CARD' as const,
          msgText: `${msgCount[index]} unread message`,
          insightType: card.insightType,
          bgColor,
          bottomBgColor,
        };
        parsedCards.push(baseCard);
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

  private getCardColor(type: 'body' | 'baby' | 'checklist') {
    try {
      switch (type) {
        case 'body':
          return {
            bgColor: PersonalisedCardColor.Body,
            bottomBgColor: PersonalisedCardColor.BodyBottom,
          };
        case 'baby':
          return {
            bgColor: PersonalisedCardColor.Baby,
            bottomBgColor: PersonalisedCardColor.BabyBottom,
          };
        case 'checklist':
          return {
            bgColor: PersonalisedCardColor.Checklist,
            bottomBgColor: PersonalisedCardColor.ChecklistBottom,
          };
      }
    } catch (error) {
      return error;
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
        image: getImageUrl(attributes?.imageUrl, false) ?? null,
        specialty: {
          name: attributes?.specialty?.data?.attributes?.name,
          image:
            getImageUrl(
              attributes.specialty.data?.attributes?.image.data?.attributes.url,
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
