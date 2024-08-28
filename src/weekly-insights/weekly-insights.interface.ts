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

export enum CartType {
  TITLE_COLOR_LIST = 'title_color_list',
  TITLE_IMAGE = 'title_image',
}
