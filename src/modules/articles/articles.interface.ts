export interface ArticleListRaw {
  articleListings: {
    data: FilteredArticlesRaw[];
  };
}

interface FilteredArticlesRaw {
  attributes: {
    trimester: number;
    article_cards: {
      data: ArticlesRaw[];
    };
  };
}

interface ArticlesRaw {
  id: string;
  attributes: {
    title: string;
    coverImg: {
      data: ImageRaw;
    };
    storyCards: ArticleStoryCardRaw[];
  };
}

interface ImageRaw {
  attributes: {
    url: string;
  };
}

interface ArticleStoryCardRaw {
  id: string;
  title: string;
  image: {
    data: ImageRaw;
  };
  bgColor: string;
  description: string;
}

export interface ParsedFilteredArticles {
  trimester: number;
  articles: ParsedArticles[];
}

interface ParsedArticles {
  title: string;
  coverImg: string;
  storyCards: ParsedStoryCard[];
}

interface ParsedStoryCard {
  id: string;
  title: string;
  image: string;
  bgColor: string;
  description: string;
}
