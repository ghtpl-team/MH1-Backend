// src/common/graphql-client.service.ts
import { Injectable } from '@nestjs/common';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { DocumentNode } from 'graphql';

@Injectable()
export class GraphQLClientService {
  private client: ApolloClient<any>;

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({ uri: process.env.STRAPI_GRAPHQL_URL, fetch }),
      cache: new InMemoryCache(),
    });
  }

  async query<T = any>(
    query: DocumentNode,
    variables: Record<string, any> = {},
  ): Promise<T> {
    try {
      const { data } = await this.client.query({ query, variables });
      return data as T;
    } catch (error) {
      throw new Error(`GraphQL query failed: ${error.message}`);
    }
  }
}
