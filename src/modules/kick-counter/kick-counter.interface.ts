export interface KickHistoryResponseObj {
  date: string;
  sessions: Array<{
    id: number;
    startTime: string;
    endTime: string;
    duration: string;
    kickCount: number;
  }>;
}
