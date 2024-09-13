import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { FILTERED_ARTICLES } from './articles.query';
import { ArticleListRaw, ParsedFilteredArticles } from './articles.interface';
import { getImageUrl } from 'src/common/utils/helper.utils';
@Injectable()
export class ArticlesService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseFilteredArticles(
    filteredArticlesRaw: ArticleListRaw,
  ): ParsedFilteredArticles {
    const data = filteredArticlesRaw?.articleListings.data[0];
    const articles = data?.attributes?.article_cards?.data;
    return {
      trimester: data.attributes.trimester,
      articles: articles.map((article) => {
        return {
          title: article.attributes.title,
          coverImg: getImageUrl(
            article.attributes.coverImg.data.attributes.url,
          ),
          storyCards: article.attributes.storyCards.map((storyCard) => {
            return {
              title: storyCard.title,
              id: storyCard.id,
              image: getImageUrl(storyCard.image.data.attributes.url),
              bgColor: storyCard.bgColor,
              description: storyCard.description,
            };
          }),
        };
      }),
    };
  }

  async getFilteredArticles(trimester: number) {
    try {
      const filteredArticlesRaw = await this.graphqlClient.query(
        FILTERED_ARTICLES,
        {
          trimester: trimester,
        },
      );

      return this.parseFilteredArticles(filteredArticlesRaw);
    } catch (error) {
      return error;
    }
  }
}
