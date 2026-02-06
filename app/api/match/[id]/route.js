// app/api/match/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  
  const match = await Match.findById(id);
  
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  return NextResponse.json(match);
}