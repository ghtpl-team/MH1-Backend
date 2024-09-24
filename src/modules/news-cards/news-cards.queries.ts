import { gql } from 'apollo-server-express';

export const GET_NEWS_CARDS = gql`
  query GetNewsCard {
    newsCards {
      data {
        id
        attributes {
          title
          date
          header
          bgImage {
            data {
              attributes {
                url
              }
            }
          }
          content
          duration
          externalUrl
        }
      }
    }
  }
`;