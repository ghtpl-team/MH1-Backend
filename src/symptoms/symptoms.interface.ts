export interface Symptom {
  name: string;
}

export interface SymptomCategory {
  name: string;
  imageUrl: string;
  bgColor: string;
  symptoms: Symptom[];
}

export interface GetSymptomListingRaw {
  symptomCategories: {
    data: Array<{
      attributes: {
        name: string;
        image: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
        bgColor: string;
        symptoms: {
          data: Array<{
            attributes: {
              name: string;
            };
          }>;
        };
      };
    }>;
  };
}
