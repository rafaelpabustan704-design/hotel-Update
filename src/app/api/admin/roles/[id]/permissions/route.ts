import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const role = db.roles.find((item) => item.id === id);
  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  }

  if (!Array.isArray(data.permissionIds)) {
    return NextResponse.json({ error: 'permissionIds must be an array' }, { status: 400 });
  }

  const permissionIds = data.permissionIds.filter((permissionId: unknown): permissionId is string => typeof permissionId === 'string');
  const validPermissionIds = new Set(db.permissions.map((permission) => permission.id));
  const hasUnknownPermission = permissionIds.some((permissionId: string) => !validPermissionIds.has(permissionId));
  if (hasUnknownPermission) {
    return NextResponse.json({ error: 'One or more permissions are invalid' }, { status: 400 });
  }

  role.permissionIds = permissionIds;
  role.updatedAt = new Date().toISOString();
  writeDb(db);
  return NextResponse.json(role);
}
