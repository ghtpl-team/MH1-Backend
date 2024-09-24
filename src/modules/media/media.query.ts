import { gql } from 'apollo-server-express';

export const EMBRYO_IMAGES = gql`
  query GetEmbryoImages {
    embryoImage {
      data {
        attributes {
          images {
            data {
              attributes {
                url
                name
              }
            }
          }
        }
      }
    }
  }
`;
