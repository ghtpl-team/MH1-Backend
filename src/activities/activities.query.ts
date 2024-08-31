import { gql } from 'apollo-server-express';

export const MIND_ACTIVITIES = gql`
  query GetMindActivities {
    mindActivitiesOverview {
      data {
        attributes {
          heading
          subHeading
          mind_activities {
            data {
              attributes {
                name
                duration
                benefits
                thumbnail {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                description
                videoUrl
              }
            }
          }
        }
      }
    }
  }
`;
