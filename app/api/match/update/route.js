// app/api/match/update/route.js
import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const { matchId, runs, isWicket, isWide, isNoBall, status } = await req.json(); // <--- ADD status here

  const match = await Match.findById(matchId);

  if (status) {
    match.status = status;
    await match.save();
    return NextResponse.json(match);
  }
  
  if (!match) return NextResponse.json({ error: "No match" }, { status: 404 });

  // 1. Handle Runs
  let runValue = runs;
  if (isWide || isNoBall) runValue += 1; 
  match.score.runs += runValue;

  // 2. Handle Wickets
  if (isWicket) match.score.wickets += 1;

  // 3. Handle Overs (Only legal balls count)
  if (!isWide && !isNoBall) {
    match.score.balls += 1;
    // Calculate readable overs (e.g. 1.5)
    const completed = Math.floor(match.score.balls / 6);
    const balls = match.score.balls % 6;
    match.score.overs = parseFloat(`${completed}.${balls}`);
  }

  // 4. Save to Database
  await match.save();
  
  return NextResponse.json(match);
}

