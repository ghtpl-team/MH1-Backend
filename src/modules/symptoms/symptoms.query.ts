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

export const GET_LOGGED_SYMPTOMS = gql`
  query GetSymptoms($loggedSymptoms: [String!]) {
    symptoms(filters: { name: { in: $loggedSymptoms } }) {
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
                specialty {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                experienceYears
                hmsDoctorId
              }
            }
          }
          description
          symptom_story {
            data {
              attributes {
                content {
                  ...GetSymptomStories
                  ...GetDocCardBtn
                }
              }
            }
          }
        }
      }
    }
  }

  fragment GetSymptomStories on ComponentCardsTitltImgDescBtn {
    rank
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

  fragment GetDocCardBtn on ComponentCardsTitleImgBtn {
    id
    title
    image {
      data {
        attributes {
          url
        }
      }
    }
    buttons: Button {
      id
      btnText
      bgColor
      textColor
    }
    bgColor
  }
`;
