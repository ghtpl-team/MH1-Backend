export interface KickHistoryResponseObj {
    [key: string]: {
      date: string;
      sessions: Array<{
        id: number;
        startTime: string;
        endTime: string;
        duration: string;
        kickCount: number;
      }>;
    };
  }