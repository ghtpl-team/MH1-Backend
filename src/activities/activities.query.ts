import { gql } from 'apollo-server-express';

export const MIND_ACTIVITIES = gql`
  query GetMindActivities {
    mindActivitiesOverview {
      data {
        attributes {
          heading
          subHeading
          mind_activities {
            data {
              attributes {
                name
                duration
                benefits
                thumbnail {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                description
                videoUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const FITNESS_ACTIVITIES = gql`
  query GetFitnessActivities($weekNumber: Int!) {
    fitnessActivities(filters: { week: { eq: $weekNumber } }) {
      data {
        attributes {
          week
          name
          videoUrl
          thumbnail {
            data {
              attributes {
                url
              }
            }
          }
          subHeading
          description {
            benefits
            precautions
          }
          consent_form {
            data {
              attributes {
                weekConfirmation {
                  heading
                  subHeading1
                  subHeading2
                  button {
                    btnText
                    bgColor
                    textColor
                  }
                }
                docInfo {
                  heading
                  subHeading
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
                      }
                    }
                  }
                  button {
                    btnText
                    bgColor
                    textColor
                  }
                }
                consentForm {
                  heading
                  subHeading
                  consentText
                  button {
                    btnText
                    bgColor
                    textColor
                  }
                }
                disclaimer {
                  heading
                  heading2
                  subHeading
                  button {
                    btnText
                    bgColor
                    textColor
                  }
                }
                unlockActivityCard {
                  heading
                  subHeading
                  button {
                    btnText
                    bgColor
                    textColor
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PREGNANCY_COACH = gql`
  query GetPregnancyCoach($weekNumber: Int!) {
    activities(filters: { week: { eq: $weekNumber } }) {
      data {
        attributes {
          week
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
                      hmsSpecialityId
                    }
                  }
                }
                experienceYears
                hmsDoctorId
              }
            }
          }
          activityCardDynamic {
            ...GetActivityCard
          }
        }
      }
    }
  }

  fragment GetActivityCard on ComponentStructuresActivityTracker {
    label {
      backgroundColor
      text
    }
    title
    image {
      data {
        attributes {
          url
        }
      }
    }
    activityType
  }
`;
