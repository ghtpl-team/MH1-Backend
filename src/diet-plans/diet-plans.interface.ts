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
