import { gql } from 'apollo-server-express';

export const LEARN_MORE = gql`
  query GetLearnMoreData {
    articles {
      data {
        attributes {
          info {
            ...GetGenericTitleWithTitleColorListCard
            ...GetGenericTitleImageColorCard
          }
          hms_doctor {
            data {
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                experienceYears
                specialty {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment GetGenericTitleWithTitleColorListCard on ComponentGenericTitleWithTitleColorList {
    id
    title
    titleColorList {
      id
      title
      color
    }
  }

  fragment GetGenericTitleImageColorCard on ComponentGenericTitleImageColor {
    id
    title
    image {
      data {
        attributes {
          url
        }
      }
    }
    color
  }
`;
