'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <--- Import Link

interface FormData {
  teamA: string;
  teamB: string;
  overs: number;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({ 
    teamA: '', 
    teamB: '', 
    overs: 10 
  });

  const startMatch = async () => {
    if (!form.teamA || !form.teamB) return alert("Please enter team names!");
    
    setLoading(true);
    try {
      const res = await fetch('/api/match/create', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data: { id: string } = await res.json();
      router.push(`/match/${data.id}`);
    } catch (error) {
      alert("Error creating match");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-black text-yellow-400 mb-8 tracking-tighter uppercase">
        🏏 IPL Tournament
      </h1>
      
      <div className="w-full max-w-md space-y-4">
        <input 
          placeholder="Home Team (e.g. RCB)" 
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none transition-colors"
          onChange={(e) => setForm({...form, teamA: e.target.value})}
        />
        <input 
          placeholder="Away Team (e.g. CSK)" 
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none transition-colors"
          onChange={(e) => setForm({...form, teamB: e.target.value})}
        />
        
        <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold text-sm uppercase">Overs:</span>
            <input 
            type="number" 
            value={form.overs}
            className="bg-transparent font-bold text-xl w-full focus:outline-none"
            onChange={(e) => setForm({...form, overs: Number(e.target.value)})}
            />
        </div>
        
        <button 
          onClick={startMatch}
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl mt-4 hover:bg-yellow-500 transition-transform active:scale-95 uppercase tracking-widest"
        >
          {loading ? 'Starting...' : 'Start Match'}
        </button>

        {/* --- NEW LEADERBOARD BUTTON --- */}
        <Link href="/leaderboard" className="block">
            <button className="w-full bg-slate-800 text-slate-300 font-bold py-4 rounded-xl mt-2 hover:bg-slate-700 transition-colors uppercase tracking-widest text-sm">
                View Leaderboard
            </button>
        </Link>
      </div>
    </div>
  );
}