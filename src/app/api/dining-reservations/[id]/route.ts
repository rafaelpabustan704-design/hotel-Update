import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();
  db.diningReservations = db.diningReservations.filter((r) => r.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
