import {
  DocInfo,
  ImageData,
  ParsedDocInfo,
} from 'src/common/interfaces/common.interface';

export interface GetLearnMoreRaw {
  articles: {
    data: Array<{
      attributes: {
        info:
          | GetGenericTitleWithTitleColorListCard[]
          | GetGenericTitleImageColorCard[];
        hms_doctor: {
          data: {
            attributes: {
              name: string;
              image: {
                data: {
                  attributes: {
                    url: string;
                  };
                };
              };
              experienceYears: number;
              specialty: {
                data: {
                  attributes: {
                    name: string;
                  };
                };
              };
            };
          };
        };
      };
    }>;
  };
}

export interface GetGenericTitleWithTitleColorListCard {
  id: string;
  title: string;
  titleColorList: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export interface GetGenericTitleImageColorCard {
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

export interface ParsedLearnMoreData {
  info:
    | ParsedGenericTitleWithTitleColorListCard[]
    | ParsedGenericTitleImageColorCard[];
  doctor: ParsedDoctor;
}

export interface ParsedGenericTitleWithTitleColorListCard {
  id: string;
  title: string;
  titleColorList: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export interface ParsedGenericTitleImageColorCard {
  id: string;
  title: string;
  imageUrl: string;
  color: string;
}

export interface ParsedDoctor {
  name: string;
  imageUrl: string;
  experienceYears: number;
  specialty: string;
}

export interface DietIntroRaw {
  dietIntros: {
    data: DietIntroStory[];
  };
}

interface DietIntroStory {
  attributes: {
    trimester: string;
    dietIntroStory: {
      data: {
        attributes: {
          firstCard: {
            id: string;
            title: string;
            cardImage: {
              data: ImageData;
            };
            docInfo: DocInfo;
            description: string;
            footerText: string;
          };
          cards: Array<{
            id: string;
            rank: number;
            title: string;
            bgColor: string;
            description: string;
            image: {
              data: ImageData[];
            };
            footerText: string;
          }>;
        };
      };
    };
    calorieCard: {
      title: string;
      id: string;
      bgImage: {
        data: ImageData;
      };
      image: {
        data: ImageData;
      };
      footerText: string;
      description: string;
    };
    nutrients: {
      id: string;
      title: string;
      image: {
        data: ImageData;
      };
      footerText: string;
      description: string;
    };
  };
}

export interface ParsedDietIntroStories {
  trimester: number;
  cards: ParsedIntroStory[];
}

export interface ParsedIntroStory {
  id: string;
  title: string;
  imageUrl?: string;
  images?: { url: string }[];
  docInfo?: ParsedDocInfo;
  description: string;
  bgColor?: string;
  bgImageUrl?: string;
  footerText?: string;
}

export interface DietChartsRawResponse {
  dietCharts: {
    data: DietChartRaw[];
  };
}

export interface DietChartRaw {
  attributes: {
    week: number;
    dietPlan: Array<{
      id: string;
      recipes: {
        data: RecipesRaw[];
      };
      mealTiming: string;
    }>;
  };
}

export interface RecipesRaw {
  id: string;
  attributes: {
    name: string;
    image: {
      data: ImageData;
    };
    contains: string[];
    notSuitableFor: string[];
    ingredients: string;
    method: string;
    videoUrl: string;
    label: Array<{
      text: string;
      backgroundColor: string;
    }>;
  };
}

export interface DietChartParsed {
  week: number;
  dietPlan: DietPlan[];
}

export interface DietPlan {
  id: string;
  recipes: Recipe[];
  mealTiming: string;
}

export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  contains: string[];
  notSuitableFor: string[];
  ingredients: string;
  method: string;
  videoUrl: string;
  label: Array<{
    name: string;
    bgColor: string;
  }>;
}
