import { gql } from 'apollo-server-express';

export const GET_SYMPTOM_CATEGORIES = gql`
  query GetSymptomListing {
    symptomCategories {
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
          bgColor
          symptoms {
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
`;
