'use client';
// 1. Check this import path. 
// If your file is at "app/types.ts", change this to: import { MatchData } from '@/app/types';
import { MatchData } from '@/app/type/types'; 
import { useState, useEffect, use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Scorer({ params }: PageProps) {
  // Unwrap the Promise
  const { id } = use(params);
  
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [extra, setExtra] = useState<'Wide' | 'NoBall' | null>(null);
  const [isWicket, setIsWicket] = useState<boolean>(false);

  // --- FIX: endMatch must be INSIDE the component to see 'id' ---
  const endMatch = async () => {
    if(!confirm("Are you sure this match is over?")) return;

    try {
        await fetch('/api/match/update', {
            method: 'POST',
            body: JSON.stringify({ matchId: id, status: 'Completed' })
        });
        // Go back to leaderboard
        window.location.href = '/leaderboard'; 
    } catch (error) {
        alert("Failed to end match");
    }
  };
  // ------------------------------------------------------------

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  const fetchMatchData = async () => {
    const res = await fetch(`/api/match/${id}`);
    if (res.ok) {
      const data: MatchData = await res.json();
      setMatch(data);
    }
  };

  const handleScore = async (runs: number) => {
    setLoading(true);
    
    const res = await fetch('/api/match/update', {
      method: 'POST',
      body: JSON.stringify({
        matchId: id,
        runs: runs,
        isWicket: isWicket,
        isWide: extra === 'Wide',
        isNoBall: extra === 'NoBall'
      }),
    });

    const updatedMatch: MatchData = await res.json();
    setMatch(updatedMatch); 
    
    setExtra(null);
    setIsWicket(false);
    setLoading(false);
  };

  if (!match) return <div className="text-white text-center mt-20">Loading Arena...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto font-sans">
      
      {/* Scoreboard Card */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 mb-6 relative overflow-hidden">
        <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">
          {match.battingTeam}
        </h2>
        
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-black text-yellow-400">{match.score.runs}</span>
          <span className="text-4xl font-bold text-slate-500">/{match.score.wickets}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-end border-t border-slate-800 pt-4">
          <div>
            <div className="text-slate-400 text-sm font-semibold uppercase">Overs</div>
            <div className="text-2xl font-bold">{match.score.overs} <span className="text-slate-600 text-lg">/ {match.totalOvers}</span></div>
          </div>
          <div>
            <div className="text-slate-400 text-sm font-semibold uppercase text-right">Run Rate</div>
            <div className="text-2xl font-bold text-right">
              {match.score.overs > 0 ? (match.score.runs / match.score.overs).toFixed(2) : "0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setExtra(extra === 'Wide' ? null : 'Wide')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${extra === 'Wide' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          WD
        </button>
        <button 
          onClick={() => setExtra(extra === 'NoBall' ? null : 'NoBall')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${extra === 'NoBall' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          NB
        </button>
        <button 
          onClick={() => setIsWicket(!isWicket)}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isWicket ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          WICKET
        </button>
      </div>

      {/* Run Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 6].map((run) => (
          <button
            key={run}
            disabled={loading}
            onClick={() => handleScore(run)}
            className={`
              h-20 rounded-2xl text-3xl font-black transition-all active:scale-90
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              ${run === 4 ? 'bg-green-600' : run === 6 ? 'bg-purple-600' : 'bg-slate-800'}
            `}
          >
            {run}
          </button>
        ))}
      </div>

      {/* End Match Button */}
      <div className="mt-8 border-t border-slate-800 pt-6">
          <button 
              onClick={endMatch}
              className="w-full py-4 rounded-xl border border-red-900 text-red-500 font-bold uppercase tracking-widest hover:bg-red-900/20"
          >
              End Match & Save
          </button>
      </div>
    </div>
  );
}