import { gql } from 'apollo-server-express';

export const LEARN_MORE = gql`
  query GetLearnMoreData {
    articles {
      data {
        attributes {
          info {
            ...GetGenericTitleWithTitleColorListCard
            ...GetGenericTitleImageColorCard
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
                experienceYears
                specialty {
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
      }
    }
  }

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
`;

export const INTRO_CARDS = gql`
  query GetDietIntroStories($trimester: Int!) {
    dietIntros(filters: { trimester: { eq: $trimester } }) {
      data {
        attributes {
          trimester
          dietIntroStory: diet_intro_story {
            data {
              attributes {
                firstCard {
                  id
                  title
                  footerText
                  cardImage {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                  docInfo: hms_doctor {
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
                      }
                    }
                  }
                  description
                }
                cards {
                  id
                  rank
                  title
                  bgColor
                  footerText
                  description
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
          calorieCard {
            title
            id
            bgImage {
              data {
                attributes {
                  url
                }
              }
            }
            image {
              data {
                attributes {
                  url
                }
              }
            }
            footerText
            description
          }
          nutrients {
            id
            title
            image {
              data {
                attributes {
                  url
                }
              }
            }
            footerText
            description
          }
        }
      }
    }
  }
`;

export const DIET_PLAN = gql`
  query GetDietPlan($weekNumber: Int!) {
    dietCharts(filters: { week: { eq: $weekNumber } }) {
      data {
        attributes {
          week
          dietPlan {
            ...GetDietPlan
          }
        }
      }
    }
  }

  fragment GetDietPlan on ComponentStructuresMealPlan {
    id
    recipes {
      data {
        id
        attributes {
          name
          contains
          notSuitableFor
          videoUrl
          ingredients
          method: Method
          image {
            data {
              attributes {
                url
              }
            }
          }
          label {
            text
            backgroundColor
          }
        }
      }
    }
    mealTiming
  }
`;
