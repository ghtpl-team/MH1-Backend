import { Injectable } from '@nestjs/common';
import { GraphQLClientService } from 'src/utils/graphql/graphql.service';
import { MIND_ACTIVITIES } from './activities.query';
import {
  MindActivitiesOverview,
  MindActivitiesRaw,
} from './activities.interface';
import { getImageUrl } from 'src/common/utils/helper.utils';

@Injectable()
export class ActivitiesService {
  constructor(private readonly graphqlClient: GraphQLClientService) {}

  private parseMindActivities(
    rawData: MindActivitiesRaw,
  ): MindActivitiesOverview {
    const { heading, subHeading, mind_activities } =
      rawData.mindActivitiesOverview.data.attributes;

    const parsedData: MindActivitiesOverview = {
      heading: heading || '',
      subHeading: subHeading || '',
      mindActivities: mind_activities.data.map((activity) => ({
        name: activity.attributes.name || '',
        duration: activity.attributes.duration || '',
        benefits: activity.attributes.benefits || '',
        thumbnail: getImageUrl(
          activity.attributes.thumbnail?.data?.attributes?.url,
        ),
        description: activity.attributes.description || '',
        videoUrl: activity.attributes.videoUrl || '',
      })),
    };

    return parsedData;
  }

  async fetchMindActivities() {
    try {
      const mindActivitiesRaw: MindActivitiesRaw =
        await this.graphqlClient.query(MIND_ACTIVITIES, {});

      const parsedMindActivityOverview: MindActivitiesOverview =
        this.parseMindActivities(mindActivitiesRaw);
      return parsedMindActivityOverview;
    } catch (error) {
      throw error;
    }
  }
}
