import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { resolvePermissionTabs, resolveRole } from '@/lib/admin-rbac';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const db = readDb();

  const match = db.adminAccounts.find(
    (a) => a.username === username && a.password === password,
  );

  if (match) {
    const role = resolveRole(db, match);
    return NextResponse.json({
      success: true,
      username: match.username,
      roleId: role?.id ?? match.roleId ?? '',
      role: role?.name ?? match.role ?? 'Super Admin',
      permissions: resolvePermissionTabs(db, match),
    });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
