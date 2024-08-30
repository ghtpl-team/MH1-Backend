import { gql } from 'apollo-server-express';

export const GET_UNSUBSCRIBED_HOME = gql`
  query GetUnsubscribedHome {
    unsubscribedHome {
      data {
        attributes {
          pregnancyCoachPromo {
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
        }
      }
    }
  }
`;
