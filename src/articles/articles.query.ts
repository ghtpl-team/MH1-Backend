import { gql } from 'apollo-server-express';

export const FILTERED_ARTICLES = gql`
  query GetArticles($trimester: Int!) {
    articleListings(filters: { trimester: { eq: $trimester } }) {
      data {
        attributes {
          trimester
          article_cards {
            data {
              attributes {
                title
                coverImg {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                storyCards {
                  id
                  title
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                  bgColor
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;
