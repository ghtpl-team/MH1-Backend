import { gql } from 'apollo-server-express';

export const FILTERED_ARTICLES = gql`
  query GetArticles($trimester: [Int!]) {
    articleListings(filters: { trimester: { in: $trimester } }) {
      data {
        attributes {
          trimester
          article_cards {
            data {
              id
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

export const BOOKMARKED_ARTICLES = gql`
  query GetBookmarkedArticles($articleIds: [ID!]) {
    articleListings(filters: { id: { in: $articleIds } }) {
      data {
        attributes {
          trimester
          article_cards {
            data {
              id
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
