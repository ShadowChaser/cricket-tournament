'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MatchSummary {
  _id: string;
  teamA: string;
  teamB: string;
  battingTeam: string;
  totalOvers: number;
  score: {
    runs: number;
    wickets: number;
    overs: number;
  };
  status: string; // 'Live' or 'Completed'
}

export default function Leaderboard() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);

  useEffect(() => {
    fetch('/api/match/all')
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-yellow-400 uppercase">Tournament Board</h1>
          <Link href="/" className="bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700">
            + New Match
          </Link>
        </div>

        <div className="space-y-4">
          {matches.map((match) => (
            <Link key={match._id} href={`/match/${match._id}`}>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-yellow-400 transition-colors cursor-pointer relative overflow-hidden">
                
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase ${
                  match.status === 'Live' ? 'bg-red-600 text-white' : 'bg-green-600 text-black'
                }`}>
                  {match.status}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-slate-400 text-sm font-bold uppercase mb-1">
                      {match.teamA} <span className="text-slate-600">vs</span> {match.teamB}
                    </h3>
                    <div className="text-2xl font-bold">
                      {match.score.runs}/{match.score.wickets} 
                      <span className="text-sm text-slate-500 ml-2">
                        ({match.score.overs} ov)
                      </span>
                    </div>
                  </div>
                  
                  {/* Visual Indicator of who is batting */}
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase">Batting</div>
                    <div className="font-bold text-yellow-400">{match.battingTeam}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {matches.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No matches played yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}