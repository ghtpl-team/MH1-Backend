import { gql } from 'apollo-server-express';

export const GET_WEEKLY_INSIGHTS = gql`
  fragment GetGenericTitleWithTitleColorListCard on ComponentGenericTitleWithTitleColorList {
    id
    title
    titleColorList {
      id
      title
      color
    }
  }

  fragment GetGenericTitleImageColorCard on ComponentGenericTitleImageColor {
    id
    title
    image {
      data {
        attributes {
          url
        }
      }
    }
    color
  }

  query WeeklyInsight($weekNumber: Int, $insightType: String) {
    weeklyInsights(
      filters: {
        weekNumber: { eq: $weekNumber }
        insightType: { eq: $insightType }
      }
    ) {
      data {
        attributes {
          weekNumber
          insightType
          babyGrowthInsight {
            data {
              attributes {
                weekNumber
                length {
                  title
                  desc
                  image {
                    data {
                      attributes {
                        url
                        previewUrl
                      }
                    }
                  }
                  color
                }
                weight {
                  title
                  desc
                  image {
                    data {
                      attributes {
                        url
                        previewUrl
                      }
                    }
                  }
                  color
                }
                size {
                  title
                  desc
                  image {
                    data {
                      attributes {
                        url
                        previewUrl
                      }
                    }
                  }
                  color
                }
              }
            }
          }
          approvedBy {
            data {
              attributes {
                hmsDoctorId
                name
                experienceYears
                image {
                  data {
                    attributes {
                      url
                      previewUrl
                    }
                  }
                }
                specialty {
                  data {
                    attributes {
                      name
                      image {
                        data {
                          attributes {
                            url
                            previewUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cards {
            ...GetGenericTitleWithTitleColorListCard
            ...GetGenericTitleImageColorCard
          }
        }
      }
    }
  }
`;

export const GET_PERSONALIZED_CARD_LISTING = gql`
  query GetPersonalizedNotesListing($weekNumber: Int) {
    personalisedNotesListings(filters: { weekNumber: { eq: $weekNumber } }) {
      data {
        attributes {
          heading
          weekNumber
          cards {
            ...GetNodeCardWithButton
            ...GetNodeCard
          }
        }
      }
    }
  }

  fragment GetNodeCardWithButton on ComponentCardsTitleDocBtn {
    id
    title
    bgColor
    ctaButton {
      textColor
      btnText
      bgColor
    }
    hms_doctor {
      data {
        attributes {
          name
          experienceYears
          hmsDoctorId
          image {
            data {
              attributes {
                previewUrl
                url
              }
            }
          }
          specialty {
            data {
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                      previewUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment GetNodeCard on ComponentCardsNoteCard {
    id
    title
    insightType
    hms_doctor {
      data {
        attributes {
          name
          image {
            data {
              attributes {
                url
                previewUrl
              }
            }
          }
          specialty {
            data {
              attributes {
                name
                image {
                  data {
                    attributes {
                      url
                      previewUrl
                    }
                  }
                }
              }
            }
          }
          hmsDoctorId
          experienceYears
        }
      }
    }
  }
`;
