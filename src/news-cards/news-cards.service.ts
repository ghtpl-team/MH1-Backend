import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { GetNewsCardRaw } from './news-cards.interface';
import { GET_NEWS_CARDS } from './news-cards.queries';
import { getImageUrl } from 'src/common/utils/helper.utils';

@Injectable()
export class NewsCardsService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  async parseNewsCards(rawData: GetNewsCardRaw) {
    return rawData.newsCards.data.map((card) => {
      const attributes = card.attributes;
      return {
        title: attributes.title,
        date: attributes.date,
        header: attributes.header,
        bgImageUrl: getImageUrl(attributes.bgImage.data?.attributes.url),
        content: attributes.content,
        duration: attributes.duration,
        sourceLink: attributes.externalUrl,
      };
    });
  }

  async fetchNewsCards() {
    try {
      const rawData: GetNewsCardRaw = await this.graphqlClient.query(
        GET_NEWS_CARDS,
        {},
      );
      return this.parseNewsCards(rawData);
    } catch (error) {
      throw error;
    }
  }
}
