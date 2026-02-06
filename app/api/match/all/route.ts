import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  // Fetch all matches, sorted by newest first (-1)
  const matches = await Match.find({}).sort({ _id: -1 });
  return NextResponse.json(matches);
}