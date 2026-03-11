import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { resolvePermissionTabs, resolveRole } from '@/lib/admin-rbac';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();

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

  if (typeof data.fullName === 'string') {
    const fullName = data.fullName.trim();
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    db.adminAccounts[idx].fullName = fullName;
  }

  if (typeof data.email === 'string') {
    db.adminAccounts[idx].email = data.email.trim();
  }

  if (typeof data.username === 'string') {
    const username = data.username.trim();
    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }
    const hasDuplicateUsername = db.adminAccounts.some(
      (account, accountIdx) => accountIdx !== idx && account.username.toLowerCase() === username.toLowerCase(),
    );
    if (hasDuplicateUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    db.adminAccounts[idx].username = username;
  }

  if (typeof data.roleId === 'string') {
    const roleExists = db.roles.some((role) => role.id === data.roleId);
    if (!roleExists) {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }
    db.adminAccounts[idx].roleId = data.roleId;
  } else if (typeof data.role === 'string') {
    const roleId = db.roles.find((role) => role.name === data.role)?.id;
    if (!roleId) {
      return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
    }
    db.adminAccounts[idx].roleId = roleId;
  }

  if (typeof data.newPassword === 'string' && data.newPassword.length > 0) {
    if (data.newPassword.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }
    db.adminAccounts[idx].password = data.newPassword;
  }

  writeDb(db);
  const account = db.adminAccounts[idx];
  const role = resolveRole(db, account);
  return NextResponse.json({
    ...account,
    roleId: role?.id ?? account.roleId ?? '',
    role: role?.name ?? 'Super Admin',
    permissions: resolvePermissionTabs(db, account),
  });
}
