import { gql } from 'apollo-server-express';

export const DYNAMIC_FORM = gql`
  query GetDynamicForm {
    dynamicForm {
      data {
        attributes {
          cards {
            ...SliderCard
            ...SinglePoll
            ...MultiPoll
            ...DocCard
          }
        }
      }
    }
  }

  fragment SliderCard on ComponentGenericSliderCard {
    question
    id
    nodeId
    goTo
    hasUnit
    showProgressBar
    cardType
    sliderRanges {
      id
      min
      max
    }
    unit
  }

  fragment SinglePoll on ComponentGenericPollInput {
    questionText
    id
    nodeId
    options
    showProgressBar
    singlePollType: cardType
  }

  fragment MultiPoll on ComponentGenericMultplePoll {
    id
    nodeId
    header
    questions {
      questionText
      options
    }
    subHeader
    multiPollType: cardType
    multiPollGoto: goTo
  }

  fragment DocCard on ComponentGenericConsultDoc {
    id
    heading
    subHeading
    nodeId
    docGoTo: goTo
    buttons: butttons {
      id
      btnText
      textColor
      bgColor
      goTo
    }
    hmsDoctor: hms_doctor {
      data {
        attributes {
          name
          imageUrl
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
  }
`;
