// app/api/match/create/route.js
import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  
  const match = await Match.create({
    teamA: body.teamA,
    teamB: body.teamB,
    totalOvers: body.overs,
    battingTeam: body.teamA, 
  });

  return NextResponse.json({ id: match._id });
}