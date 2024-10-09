import { Injectable, Logger } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { BOOKMARKED_ARTICLES, FILTERED_ARTICLES } from './articles.query';
import { ArticleListRaw, ParsedFilteredArticles } from './articles.interface';
import { getImageUrl } from 'src/common/utils/helper.utils';
import { EntityManager } from '@mikro-orm/mysql';
import { BookmarkedArticle } from 'src/entities/bookmarked-articles.entity';
import { Status } from 'src/entities/base.entity';
@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(
    private readonly graphqlClient: GraphQLClientService,
    private readonly em: EntityManager,
  ) {}

  private parseFilteredArticles(
    filteredArticlesRaw: ArticleListRaw,
    bookmarkedArticles: Array<{ articleId: string; id: number }>,
    isUnsubscribed: boolean,
  ): ParsedFilteredArticles {
    try {
      const articlesAllData = filteredArticlesRaw?.articleListings.data;
      const responseObj = [];
      articlesAllData.forEach((data) => {
        const articles = data?.attributes?.article_cards?.data;
        articles.forEach((article) => {
          responseObj.push({
            trimester: data.attributes.trimester,
            id: article.id,
            title: article.attributes.title,
            isBookmarked: isUnsubscribed
              ? undefined
              : bookmarkedArticles.find(
                    (bookmarkedArticle) =>
                      bookmarkedArticle.articleId === article.id,
                  )
                ? true
                : false,
            coverImg: getImageUrl(
              article.attributes.coverImg.data.attributes.url,
            ),
            storyCards: isUnsubscribed
              ? undefined
              : article.attributes.storyCards.map((storyCard) => {
                  return {
                    title: storyCard.title,
                    id: storyCard.id,
                    image: getImageUrl(storyCard.image?.data?.attributes?.url),
                    bgColor: storyCard.bgColor,
                    description: storyCard.description,
                  };
                }),
          });
        });
      });

      return {
        articles: responseObj,
      };
    } catch (error) {
      this.logger.error('cant parse article data', error.stack || error);
      throw error;
    }
  }

  async getFilteredArticles(
    trimesterList: number[],
    userId: number,
    searchText: string,
    isUnsubscribed: boolean,
  ) {
    try {
      if (isUnsubscribed) {
        trimesterList = [1];
        searchText = null;
      }
      const filteredArticlesRaw = await this.graphqlClient.query(
        FILTERED_ARTICLES,
        {
          trimester: searchText ? undefined : trimesterList,
          searchText: searchText ?? '',
        },
      );

      const bookmarkedArticles =
        await this.findBookmarkedArticleByUserId(userId);

      const parsedArticle = this.parseFilteredArticles(
        filteredArticlesRaw,
        bookmarkedArticles,
        isUnsubscribed,
      );

      return parsedArticle;
    } catch (error) {
      this.logger.error('unable to fetch article data', error.stack || error);
      throw error;
    }
  }

  async bookmarkArticle(articleId: string, userId: number) {
    try {
      const bookmark = this.em.create(BookmarkedArticle, {
        articleId,
        user: userId,
      });

      await this.em.flush();
      return bookmark;
    } catch (error) {
      this.logger.error('unable to bookmark article', error.stack || error);
      throw error;
    }
  }

  private async findBookmarkedArticleByUserId(userId: number) {
    try {
      return await this.em
        .createQueryBuilder(BookmarkedArticle)
        .select(['articleId', 'id'])
        .where({
          user: userId,
          status: Status.ACTIVE,
        });
    } catch (error) {
      this.logger.error(
        'unable to find bookmarked article',
        error.stack || error,
      );
      throw error;
    }
  }

  async getBookmarkedArticles(userId: number) {
    try {
      const bookmarkedArticles =
        await this.findBookmarkedArticleByUserId(userId);

      if (!bookmarkedArticles.length) {
        return [];
      }

      const bookmarkedArticlesRaw = await this.graphqlClient.query(
        BOOKMARKED_ARTICLES,
        {
          articleIds: bookmarkedArticles.map((article) => {
            return article.articleId;
          }),
        },
      );

      return this.parseFilteredArticles(
        bookmarkedArticlesRaw,
        bookmarkedArticles,
        false,
      );
    } catch (error) {
      this.logger.error(
        'unable to fetch bookmarked articles',
        error.stack || error,
      );
      throw error;
    }
  }

  async unBookmarkArticle(articleId: string, userId: number) {
    try {
      const updatedBookmarkedArticles = await this.em.nativeUpdate(
        BookmarkedArticle,
        {
          articleId,
          user: userId,
        },
        {
          status: Status.DELETED,
        },
      );

      return {
        status: updatedBookmarkedArticles > 0,
        message:
          updatedBookmarkedArticles > 0
            ? 'Article un bookmarked'
            : 'Article not bookmarked',
      };
    } catch (error) {
      this.logger.error('unable to un bookmark article', error.stack || error);
      throw error;
    }
  }
}
