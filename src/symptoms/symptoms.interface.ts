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

export interface LoggedSymptomsRaw {
  symptoms: {
    data: Array<{
      attributes: {
        name?: string;
        image?: {
          data?: {
            attributes?: {
              url?: string;
            };
          };
        };
        hms_doctor?: {
          data?: {
            attributes?: {
              name?: string;
              image?: {
                data?: {
                  attributes?: {
                    url?: string;
                  };
                };
              };
              specialty?: {
                data?: {
                  attributes?: {
                    name?: string;
                  };
                };
              };
              hmsDoctorId?: string;
            };
          };
        };
        description?: string;
        symptom_story?: {
          data?: {
            attributes?: {
              content?: Array<{
                rank?: number;
                title?: string;
                image?: {
                  data?: {
                    attributes?: {
                      url?: string;
                    };
                  };
                };
                bgColor?: string;
                description?: string;
              }>;
            };
          };
        };
      };
    }>;
  };
}
