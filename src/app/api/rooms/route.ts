import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.rooms);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  const room = {
    id: randomUUID(),
    name: String(data.name ?? ''),
    roomTypeId: String(data.roomTypeId ?? ''),
    price: Number(data.price) || 0,
    maxPax: Number(data.maxPax) || 1,
    description: String(data.description ?? ''),
    longDescription: String(data.longDescription ?? ''),
    tagline: String(data.tagline ?? ''),
    bedType: String(data.bedType ?? ''),
    bedQty: Number(data.bedQty) || 1,
    extraBedType: String(data.extraBedType ?? ''),
    extraBedQty: Number(data.extraBedQty) || 0,
    roomSize: String(data.roomSize ?? ''),
    view: String(data.view ?? ''),
    amenities: Array.isArray(data.amenities) ? data.amenities.map(String) : [],
    inclusions: Array.isArray(data.inclusions) ? data.inclusions.map(String) : [],
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    createdAt: new Date().toISOString(),
  };

  db.rooms.push(room);
  writeDb(db);
  return NextResponse.json(room, { status: 201 });
}
