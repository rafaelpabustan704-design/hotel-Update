import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();

  if (db.adminAccounts.length <= 1) {
    return NextResponse.json({ error: 'Cannot delete the last admin account' }, { status: 400 });
  }

  db.adminAccounts = db.adminAccounts.filter((a) => a.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
