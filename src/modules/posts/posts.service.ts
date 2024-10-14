import { EntityManager, QueryOrder, raw } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto, CreateUserImpressionDto } from './dto/posts.dto';
import {
  ImpressionType,
  UserImpressions,
} from 'src/entities/user-impressions.entity';
import { Status } from 'src/entities/base.entity';
import {
  UserImpressionsQueryResult,
  UserImpressionsResponse,
} from './posts.interface';
import { UserComment } from 'src/entities/user-comments.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(private readonly em: EntityManager) {}

  async addUserImpression(
    userId: number,
    requestBody: CreateUserImpressionDto,
  ) {
    try {
      const { postId, impressionType, isLiked, isDisliked } = requestBody;
      const qb = this.em.createQueryBuilder(UserImpressions);
      if (isLiked && impressionType === ImpressionType.DISLIKE) {
        await qb.update({ impressionType: ImpressionType.DISLIKE }).where({
          postId,
          user: userId,
          impressionType: ImpressionType.LIKE,
        });
      } else if (isDisliked && impressionType === ImpressionType.LIKE) {
        await qb.update({ impressionType: ImpressionType.LIKE }).where({
          postId,
          user: userId,
          impressionType: ImpressionType.LIKE,
        });
      } else {
        await this.em.create(UserImpressions, {
          postId,
          user: userId,
          impressionType,
        });
      }
      await this.em.flush();
      return {
        success: true,
        message: 'User impression added successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error adding user impression for user ${userId} and post ${requestBody.postId}`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async parseUserImpressions(userImpressions: UserImpressionsQueryResult[]) {
    try {
      const initialObject = Object.values(ImpressionType).reduce(
        (acc, curr) => {
          switch (curr) {
            case ImpressionType.LIKE:
              acc.likeCount = 0;
              acc.isLiked = false;
              break;
            case ImpressionType.DISLIKE:
              acc.dislikeCount = 0;
              acc.isDisliked = false;
              break;
            case ImpressionType.HAPPY:
              acc.happyCount = 0;
              acc.isHappy = false;
              break;
            case ImpressionType.LOVE:
              acc.loveCount = 0;
              acc.isLoved = false;
              break;
            default:
              break;
          }
          return acc;
        },
        {} as UserImpressionsResponse,
      );
      const parsedResponse = userImpressions.reduce((acc, curr) => {
        const { impressionType, totalCount, userImpression } = curr;
        switch (impressionType) {
          case ImpressionType.LIKE:
            acc.likeCount = totalCount;
            acc.isLiked = userImpression ? true : false;
            break;
          case ImpressionType.DISLIKE:
            acc.dislikeCount = totalCount;
            acc.isDisliked = userImpression ? true : false;
            break;
          case ImpressionType.HAPPY:
            acc.happyCount = totalCount;
            acc.isHappy = userImpression ? true : false;
            break;
          case ImpressionType.LOVE:
            acc.loveCount = totalCount;
            acc.isLoved = userImpression ? true : false;
          default:
            break;
        }
        return acc;
      }, initialObject as UserImpressionsResponse);

      return parsedResponse;
    } catch (error) {
      this.logger.error(
        `Error parsing user impressions`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async findAll(userId: number, postId: string) {
    try {
      const userImpressions = (await this.em
        .createQueryBuilder(UserImpressions, 'userImp')
        .select([
          'userImp.impressionType',
          raw('COUNT(userImp.id) as totalCount'),
          raw(
            'MAX(CASE WHEN userImp.user_id = :userId THEN 1 ELSE 0 END) AS userImpression',
            {
              userId,
            },
          ),
        ])
        .groupBy(['impressionType'])
        .where({
          status: Status.ACTIVE,
          postId,
        })
        .execute()) as UserImpressionsQueryResult[];

      const parsedResult = await this.parseUserImpressions(userImpressions);

      return parsedResult;
    } catch (error) {
      this.logger.error(
        `Error finding user impressions for user ${userId}`,
        error?.stack || error,
      );
      return error;
    }
  }

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    try {
      const { postId, commentText } = createCommentDto;
      const comment = this.em.create(UserComment, {
        user: userId,
        postId,
        commentText,
      });
      await this.em.flush();

      return comment;
    } catch (error) {
      this.logger.error(
        `Error creating comment for user ${userId}`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async addCommentUserImpression(
    userId: number,
    requestBody: CreateUserImpressionDto,
  ) {
    try {
      throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    } catch (error) {
      this.logger.error(
        `Error adding user impression for user ${userId} and post ${requestBody.postId}`,
        error?.stack || error,
      );
      throw error;
    }
  }

  async findAllComments(userId: number, postId: string) {
    try {
      const comments = await this.em
        .createQueryBuilder(UserComment, 'userComment')
        .select(['id', raw('comment_text as comment'), 'updatedAt'])
        .where({
          status: Status.ACTIVE,
          postId,
        })
        .orderBy({
          updatedAt: QueryOrder.DESC,
        })
        .execute();

      return comments;
    } catch (error) {
      this.logger.error(
        `Error finding user impressions for user ${userId}`,
        error?.stack || error,
      );
      throw error;
    }
  }
}
