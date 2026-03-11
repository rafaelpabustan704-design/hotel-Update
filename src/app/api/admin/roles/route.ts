import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.roles);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  const name = String(data.name ?? '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
  }

  const duplicate = db.roles.some((role) => role.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    return NextResponse.json({ error: 'Role name already exists' }, { status: 400 });
  }

  const permissionIds = Array.isArray(data.permissionIds)
    ? data.permissionIds.filter((id: unknown): id is string => typeof id === 'string')
    : [];

  const validPermissionIds = new Set(db.permissions.map((permission) => permission.id));
  const hasUnknownPermission = permissionIds.some((id: string) => !validPermissionIds.has(id));
  if (hasUnknownPermission) {
    return NextResponse.json({ error: 'One or more permissions are invalid' }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const role = {
    id: randomUUID(),
    name,
    description: String(data.description ?? '').trim(),
    isSystem: false,
    permissionIds,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.roles.push(role);
  writeDb(db);
  return NextResponse.json(role, { status: 201 });
}
