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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const idx = db.adminAccounts.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const validRoles = ['Super Admin', 'Reservations Manager', 'Content Editor', 'Custom'];
  if (data.role && validRoles.includes(data.role)) {
    db.adminAccounts[idx].role = data.role;
  }

  if (data.role === 'Custom' && Array.isArray(data.permissions)) {
    db.adminAccounts[idx].permissions = data.permissions;
  } else if (data.role !== 'Custom') {
    delete db.adminAccounts[idx].permissions;
  }

  if (data.newPassword && typeof data.newPassword === 'string' && data.newPassword.length >= 4) {
    db.adminAccounts[idx].password = data.newPassword;
  }

  writeDb(db);
  return NextResponse.json(db.adminAccounts[idx]);
}
