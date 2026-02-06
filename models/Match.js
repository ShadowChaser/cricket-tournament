// models/Match.js
import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  totalOvers: Number,
  battingTeam: { type: String, default: 'Team A' }, 
  score: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    balls: { type: Number, default: 0 }, // Legal balls only
    overs: { type: Number, default: 0 },
  },
  status: { type: String, default: 'Live' },
  // Timeline stores every ball event
  timeline: [{
    over: Number,
    ball: Number,
    runs: Number,
    event: String // "Wide", "Wicket", "Normal"
  }]
});

// This prevents "Model already exists" errors in Next.js
export default mongoose.models.Match || mongoose.model('Match', MatchSchema);