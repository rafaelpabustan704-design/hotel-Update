import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { randomUUID } from 'crypto';
import { resolvePermissionTabs, resolveRole } from '@/lib/admin-rbac';

export async function GET() {
  const db = readDb();
  return NextResponse.json(
    db.adminAccounts.map((account) => {
      const role = resolveRole(db, account);
      const resolvedPermissions = resolvePermissionTabs(db, account);
      return {
        ...account,
        roleId: role?.id ?? account.roleId ?? '',
        role: role?.name ?? account.role ?? 'Super Admin',
        permissions: resolvedPermissions,
      };
    }),
  );
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  if (db.adminAccounts.some((a) => a.username.toLowerCase() === String(data.username).toLowerCase())) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }
  if (String(data.username).length < 3) {
    return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
  }
  if (String(data.password).length < 4) {
    return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
  }
  if (!String(data.fullName ?? '').trim()) {
    return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
  }

  let roleId = typeof data.roleId === 'string' ? data.roleId : '';
  if (!roleId && typeof data.role === 'string') {
    roleId = db.roles.find((role) => role.name === data.role)?.id ?? '';
  }
  if (!roleId) {
    roleId = db.roles.find((role) => role.name === 'Super Admin')?.id ?? '';
  }

  if (!db.roles.some((role) => role.id === roleId)) {
    return NextResponse.json({ error: 'Invalid role selected' }, { status: 400 });
  }

  const account = {
    id: randomUUID(),
    fullName: String(data.fullName).trim(),
    email: String(data.email ?? '').trim(),
    username: String(data.username),
    password: String(data.password),
    roleId,
    createdAt: new Date().toISOString(),
  };

  db.adminAccounts.push(account);
  writeDb(db);
  const role = resolveRole(db, account);
  return NextResponse.json({
    ...account,
    roleId: role?.id ?? account.roleId ?? '',
    role: role?.name ?? 'Super Admin',
    permissions: resolvePermissionTabs(db, account),
  }, { status: 201 });
}
