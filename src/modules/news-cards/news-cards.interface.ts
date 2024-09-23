export interface GetNewsCardRaw {
  newsCards: {
    data: Array<{
      id: string;
      attributes: {
        title: string;
        date: string;
        header: string;
        bgImage: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
        content: string;
        duration: string;
        externalUrl: string;
      };
    }>;
  };
}

// Parsed NewsCard type
export interface ParsedNewsCard {
  title: string;
  date: string;
  header: string;
  bgImageUrl: string | null;
  content: string;
  duration: string;
  sourceLink: string;
}
