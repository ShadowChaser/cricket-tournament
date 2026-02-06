// types.ts (optional, or just paste at top of file)
export interface MatchData {
  _id: string;
  teamA: string;
  teamB: string;
  battingTeam: string;
  totalOvers: number;
  score: {
    runs: number;
    wickets: number;
    balls: number;
    overs: number;
  };
  status: string;
}