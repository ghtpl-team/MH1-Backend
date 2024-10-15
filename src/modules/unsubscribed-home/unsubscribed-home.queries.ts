import { gql } from 'apollo-server-express';

export const GET_UNSUBSCRIBED_HOME = gql`
  query GetUnsubscribedHome {
    unsubscribedHome {
      data {
        attributes {
          unsubNotes {
            id
            heading
            noteGifs {
              data {
                attributes {
                  url
                }
              }
            }
          }
          pregnancyCoachPromo {
            header
            btnText
            image {
              data {
                attributes {
                  url
                }
              }
            }
            title
            content
          }
          pregnancyCoachAd {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            title
            bgColor
            btnText
            btnBgColor
          }
          dietPlanPromo {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            title
            content
            getMhSubBtn {
              btnText
              bgColor
            }
            dietPromoBtn {
              btnText
              bgColor
            }
          }
          dietPlanAd {
            text
            bgImage {
              data {
                attributes {
                  url
                }
              }
            }
            animationText
          }
          promoVideos {
            data {
              attributes {
                url
              }
            }
          }
          unsubSymptom {
            id
            heading
            symptomCard {
              title
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              id
            }
            description
            image {
              data {
                attributes {
                  url
                }
              }
            }
            getSubBtn {
              id
              btnText
              textColor
              bgColor
            }
          }
        }
      }
    }
  }
`;

export const INTRO_CARDS = gql`
  query GetIntroCards {
    introCard {
      data {
        attributes {
          cards {
            id
            header
            subHeader
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;
