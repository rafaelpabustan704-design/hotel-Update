import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.roomTypes);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  const roomType = {
    id: randomUUID(),
    name: String(data.name ?? ''),
    totalRooms: Number(data.totalRooms) || 1,
    maxAdults: Number(data.maxAdults) || 1,
    maxChildren: Number(data.maxChildren) || 0,
    color: String(data.color ?? 'blue'),
    createdAt: new Date().toISOString(),
  };

  db.roomTypes.push(roomType);
  writeDb(db);
  return NextResponse.json(roomType, { status: 201 });
}
