import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.diningReservations);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  const reservation = {
    id: randomUUID(),
    fullName: String(data.fullName ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    restaurant: String(data.restaurant ?? ''),
    date: String(data.date ?? ''),
    time: String(data.time ?? ''),
    adults: Number(data.adults) || 0,
    children: Number(data.children) || 0,
    specialRequests: String(data.specialRequests ?? ''),
    createdAt: new Date().toISOString(),
  };

  db.diningReservations.push(reservation);
  writeDb(db);
  return NextResponse.json(reservation, { status: 201 });
}
