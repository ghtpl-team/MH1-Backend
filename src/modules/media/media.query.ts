import { gql } from 'apollo-server-express';

export const EMBRYO_IMAGES = gql`
  query GetEmbryoImages {
    embryoImage {
      data {
        attributes {
          images(pagination: { pageSize: 50 }) {
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
