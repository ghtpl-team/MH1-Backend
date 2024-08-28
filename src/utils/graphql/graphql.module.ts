// src/modules/third-party-api1/third-party-api1.module.ts
import { Module } from '@nestjs/common';
import { GraphQLClientService } from './graphql.service';

@Module({
  providers: [GraphQLClientService],
  controllers: [],
})
export class ThirdPartyApi1Module {}
