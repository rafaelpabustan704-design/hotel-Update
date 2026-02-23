import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  return NextResponse.json(readDb().sectionHeaders);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const db = readDb();
  db.sectionHeaders = {
    rooms: { ...db.sectionHeaders.rooms, ...data.rooms },
    dining: { ...db.sectionHeaders.dining, ...data.dining },
    amenities: { ...db.sectionHeaders.amenities, ...data.amenities },
    contact: { ...db.sectionHeaders.contact, ...data.contact },
  };
  writeDb(db);
  return NextResponse.json(db.sectionHeaders);
}
