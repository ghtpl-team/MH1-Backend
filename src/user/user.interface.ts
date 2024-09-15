export interface RawDynamicFormData {
  dynamicForm: {
    data: {
      attributes: {
        cards: (
          | ComponentGenericSliderCard
          | ComponentGenericPollInput
          | ComponentGenericMultiplePoll
          | ComponentGenericConsultDoc
        )[];
      };
    };
  };
}

interface ComponentGenericSliderCard {
  type: 'slider';
  question: string;
  id: string;
  nodeId: string;
  goTo: string;
  hasUnit: boolean;
  showProgressBar: boolean;
  cardType: string;
  sliderRanges: {
    id: string;
    min: number;
    max: number;
  }[];
  unit: string;
}

interface ComponentGenericPollInput {
  questionText: string;
  id: string;
  nodeId: string;
  options: any[];
  showProgressBar: boolean;
  singlePollType: string;
}

interface ComponentGenericMultiplePoll {
  id: string;
  nodeId: string;
  header: string;
  questions: {
    questionText: string;
    options: any[];
  }[];
  subHeader: string;
  goTo: string;
  multiPollType: string;
  multiPollGoto: string;
}

interface ComponentGenericConsultDoc {
  id: string;
  heading: string;
  subHeading: string;
  nodeId: string;
  goTo: string;
  buttons: {
    id: string;
    btnText: string;
    textColor: string;
    bgColor: string;
    goTo: string;
  }[];
}

export interface ParsedDynamicForm {
  cards: (
    | ParsedSliderCard
    | ParsedSinglePoll
    | ParsedMultiPoll
    | ParsedDocCard
  )[];
}

export interface ParsedSliderCard {
  id: string;
  question: string;
  nodeId: string;
  goTo: string;
  hasUnit: boolean;
  showProgressBar: boolean;
  cardType: string;
  sliderRanges: {
    id: string;
    min: number;
    max: number;
  }[];
  unit: string;
}

export interface ParsedSinglePoll {
  id: string;
  questionText: string;
  nodeId: string;
  options: any[];
  showProgressBar: boolean;
  cardType: string;
}

export interface ParsedMultiPoll {
  id: string;
  nodeId: string;
  header: string;
  questions: {
    questionText: string;
    options: any[];
  }[];
  subHeader: string;
  cardType: string;
  goTo: string;
}

export interface ParsedDocCard {
  id: string;
  heading: string;
  subHeading: string;
  nodeId: string;
  goTo: string;
  buttons: {
    id: string;
    btnText: string;
    textColor: string;
    bgColor: string;
    goTo: string;
  }[];
}
