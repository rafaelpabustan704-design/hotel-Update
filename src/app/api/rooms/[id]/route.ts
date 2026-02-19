import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const idx = db.rooms.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  db.rooms[idx] = { ...db.rooms[idx], ...data, id };
  writeDb(db);
  return NextResponse.json(db.rooms[idx]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();
  db.rooms = db.rooms.filter((r) => r.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
