import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { createItemRoutes } from '@/lib/api-helpers';

export const { PUT } = createItemRoutes('roomTypes');

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
