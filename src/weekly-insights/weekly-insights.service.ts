import { gql } from 'apollo-server-express';
import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Injectable()
export class WeeklyInsightsService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  async fetch(weekNumber: number) {
    try {
      console.log(weekNumber);

      const query = gql`
        query GetWeeklyInsights {
          weeklyInsights(filters: { weekNumber: { eq: 1 } }) {
            data {
              id
              attributes {
                weekNumber
                insightType
              }
            }
          }
        }
      `;

      const data = await this.graphqlClient.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
