import {
  GenericButton,
  ImageData,
} from 'src/common/interfaces/common.interface';

export interface WeeklyInsightResponseRaw {
  weeklyInsights: {
    data: Array<{
      attributes: WeeklyInsightAttributes;
    }>;
  };
}

export interface WeeklyInsightAttributes {
  weekNumber: number;
  insightType: string;
  babyGrowthInsight: {
    data: {
      attributes: BabyGrowthInsightAttributes;
    };
  };
  approvedBy: {
    data: {
      attributes: ApprovedByAttributes;
    };
  };
  cards: Array<GenericTitleWithTitleColorList | GenericTitleImageColor>;
}

export interface BabyGrowthInsightAttributes {
  weekNumber: number;
  length: GrowthAttribute;
  weight: GrowthAttribute;
  size: GrowthAttribute;
}

export interface GrowthAttribute {
  title: string;
  desc: string;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  color: string;
}

export interface ImageAttributes {
  url: string;
  previewUrl: string;
}

export interface ApprovedByAttributes {
  hmsDoctorId: string;
  name: string;
  imageUrl: string;
  experienceYears: number;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  specialty: {
    data: {
      attributes: SpecialtyAttributes;
    };
  };
}

export interface SpecialtyAttributes {
  name: string;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
}

export interface GenericTitleWithTitleColorList {
  id: string;
  title: string;
  titleColorList: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export interface GenericTitleImageColor {
  id: string;
  title: string;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  color: string;
}
export enum InsightType {
  BABY = 'baby',
  BODY = 'body',
  CHECKLIST = 'checklist',
}

export interface GetPersonalizedNotesListingResponse {
  personalisedNotesListings: {
    data: Array<{
      attributes: PersonalizedNotesListingAttributes;
    }>;
  };
}

export interface PersonalizedNotesListingAttributes {
  heading: string;
  weekNumber: number;
  weeklyScanCard: WeeklyScans;
  counselingCard: CounselingCard;
  cards: Array<ComponentCardsNoteCard>;
}

export interface WeeklyScans {
  data: {
    attributes: {
      scanDetails: ComponentCardsTitleImgBtn;
    };
  };
}

export interface ComponentCardsTitleImgBtn {
  __typename: 'ComponentCardsTitleImgBtn';
  title: string;
  image: {
    data: ImageData;
  };
  button: GenericButton;
  bgColor: string;
}

export interface CounselingCard {
  data: {
    attributes: {
      counselingCard: ComponentCardsTitleImgBtn;
    };
  };
}

export interface ComponentCardsNoteCard {
  __typename: 'ComponentCardsNoteCard';
  id: string;
  title: string;
  insightType: string;
  bgColor: string;
  bgBottomColor: string;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  hms_doctor: {
    data: {
      attributes: HmsDoctorAttributes;
    };
  };
}

export interface HmsDoctorAttributes {
  name: string;
  experienceYears: number;
  hmsDoctorId: string;
  imageUrl: string;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
  specialty: {
    data: {
      attributes: SpecialtyAttributes;
    };
  };
}

export interface ImageAttributes {
  previewUrl: string;
  url: string;
}

export interface SpecialtyAttributes {
  name: string;
  image: {
    data: {
      attributes: ImageAttributes;
    };
  };
}

export interface GetPersonalizedNotesListingVariables {
  weekNumber: number;
}

export interface ParsedCard {
  id: string;
  title: string;
  type: 'TITLE_DOC_BTN' | 'NOTE_CARD';
  bgColor?: string;
  bottomBgColor?: string;
  ctaButton?: {
    textColor: string;
    btnText: string;
    bgColor: string;
  };
  chatUrl?: string;
  msgText?: string;
  image?: string;
  insightType?: string;
  doctor?: {
    name: string;
    experienceYears: number;
    hmsDoctorId: string;
    image: string | null;
    specialty: {
      name: string;
      image: string | null;
    };
  };
}

export interface ParsedPersonalisedNotes {
  heading: string;
  weekNumber: number;
  cards: ParsedCard[];
}

export enum NotesCardType {
  TITLE_DOC_BTN = 'note_card_with_button',
  TITLE_DOC = 'note_card',
}

export enum InsightCardType {
  TITLE_COLOR_LIST = 'title_color_list',
  TITLE_IMAGE = 'title_image',
}

export interface ParsedUnsubscribedHome {
  // personalisedNotes: {
  //   heading: string;
  //   notes: Array<{
  //     id: string;
  //     imageUrl: string;
  //   }>;
  // };
  pregnancyCoachPromo: Array<{
    image: string | null;
    title: string;
    content: string;
    btnText: string;
    header: string;
  }>;
  // pregnancyCoachAd: {
  //   image: string | null;
  //   title: string | null;
  //   bgColor: string;
  //   btnText: string;
  //   btnBgColor: string;
  // };
  dietPlanPromo: Array<{
    image: string | null;
    title: string;
    content: string;
    getMhSubBtn: {
      btnText: string;
      bgColor: string;
    };
    dietPromoBtn: {
      btnText: string;
      bgColor: string | null;
    };
  }>;
  dietPlanAd: {
    text: string;
    bgImage: string | null;
    animationText: string | null;
  };
  symptoms: {
    heading: string;
    cards: Array<{ title: string; imageUrl: string; id: string }>;
    description: string;
    image: string;
  };
}
