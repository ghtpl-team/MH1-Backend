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
