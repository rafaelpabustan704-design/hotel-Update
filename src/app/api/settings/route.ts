import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.settings);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const db = readDb();
  db.settings = { ...db.settings, ...data };
  writeDb(db);
  return NextResponse.json(db.settings);
}
