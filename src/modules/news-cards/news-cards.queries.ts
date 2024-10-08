import { gql } from 'apollo-server-express';

export const GET_NEWS_CARDS = gql`
  query GetNewsCard {
    newsCards(sort: ["date:desc"]) {
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
