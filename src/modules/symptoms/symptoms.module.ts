import { Module } from '@nestjs/common';
import { SymptomsController } from './symptoms.controller';
import { SymptomsService } from './symptoms.service';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';

@Module({
  controllers: [SymptomsController],
  providers: [SymptomsService, GraphQLClientService],
})
export class SymptomsModule {}
