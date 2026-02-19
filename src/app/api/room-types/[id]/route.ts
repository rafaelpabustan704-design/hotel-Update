import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const idx = db.roomTypes.findIndex((rt) => rt.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
  }

  db.roomTypes[idx] = { ...db.roomTypes[idx], ...data, id };
  writeDb(db);
  return NextResponse.json(db.roomTypes[idx]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();

  if (db.roomTypes.length <= 1) {
    return NextResponse.json({ error: 'Cannot delete the last room type' }, { status: 400 });
  }

  db.roomTypes = db.roomTypes.filter((rt) => rt.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
