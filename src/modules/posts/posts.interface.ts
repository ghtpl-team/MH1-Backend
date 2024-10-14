export interface UserImpressionsResponse {
  likeCount: number;
  dislikeCount: number;
  loveCount: number;
  happyCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isLoved: boolean;
  isHappy: boolean;
}

export interface UserImpressionsQueryResult {
  impressionType: string;
  totalCount: number;
  userImpression: number;
}
