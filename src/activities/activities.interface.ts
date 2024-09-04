export interface MindActivity {
  name: string;
  duration: string;
  benefits: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
}

export interface MindActivitiesOverview {
  heading: string;
  subHeading: string;
  mindActivities: MindActivity[];
}

export interface MindActivitiesRaw {
  mindActivitiesOverview: {
    data: {
      attributes: {
        heading: string;
        subHeading: string;
        mind_activities: {
          data: Array<{
            attributes: {
              name: string;
              duration: string;
              benefits: string;
              thumbnail: {
                data: {
                  attributes: {
                    url: string;
                  };
                };
              };
              description: string;
              videoUrl: string;
            };
          }>;
        };
      };
    };
  };
}

export interface Button {
  btnText: string;
  bgColor: string;
  textColor: string;
}

interface Thumbnail {
  data: {
    attributes: {
      url: string;
    };
  };
}

interface Description {
  benefits: string;
  precautions: string;
}

export interface Doctor {
  name: string;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  specialty: {
    data: {
      attributes: {
        name: string;
      };
    };
  };
  experienceYears: number;
}

export interface ConsentForm {
  weekConfirmation: {
    heading: string;
    subHeading1: string;
    subHeading2: string;
    button: Button;
  };
  docInfo: {
    heading: string;
    subHeading: string;
    hms_doctor: {
      data: {
        attributes: Doctor;
      };
    };
    button: Button;
  };
  consentForm: {
    heading: string;
    subHeading: string;
    consentText: string;
    button: Button;
  };
  disclaimer: {
    heading: string;
    heading2: string;
    subHeading: string;
    button: Button;
  }[];
  unlockActivityCard: {
    heading: string;
    subHeading: string;
    button: Button;
  };
}

interface FitnessActivity {
  week: number;
  name: string;
  videoUrl: string;
  thumbnail: Thumbnail;
  subHeading: string;
  description: Description;
  consent_form: {
    data: {
      attributes: ConsentForm;
    };
  };
}

export interface GetPregnancyCoachRaw {
  activities: {
    data: Array<{
      attributes: {
        week: number;
        hms_doctor: {
          data: {
            attributes: Doctor;
          };
        };
        activityCardDynamic: ActivityCard[];
      };
    }>;
  };
}

type ActivityCard = {
  label: {
    backgroundColor: string;
    text: string;
  };
  title: string;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  activityType: string;
};

export interface FitnessActivitiesRaw {
  fitnessActivities: {
    data: {
      attributes: FitnessActivity;
    }[];
  };
}

export interface ParsedFitnessActivities {
  activities: ParsedFitnessActivity[];
}

export interface ParsedFitnessActivity {
  week: number;
  name: string;
  videoUrl: string;
  thumbnailUrl: string;
  subHeading: string;
  description: Description;
  consentForm: ParsedConsentForm;
}

export interface ParsedConsentForm {
  weekConfirmation: {
    heading: string;
    subHeading1: string;
    subHeading2: string;
    button: Button;
  };
  docInfo: {
    heading: string;
    subHeading: string;
    doctor: ParsedDoctor;
    button: Button;
  };
  consentForm: {
    heading: string;
    subHeading: string;
    consentText: string;
    button: Button;
  };
  disclaimer: {
    heading: string;
    heading2: string;
    subHeading: string;
    button: Button;
  }[];
  unlockActivityCard: {
    heading: string;
    subHeading: string;
    button: Button;
  };
}

export interface ParsedDoctor {
  name: string;
  imageUrl: string;
  specialty: string;
  experienceYears: number;
}
