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
