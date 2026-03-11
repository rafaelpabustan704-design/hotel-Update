import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const idx = db.roles.findIndex((role) => role.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  }

  if (typeof data.name === 'string') {
    const name = data.name.trim();
    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const duplicate = db.roles.some(
      (role, roleIdx) => roleIdx !== idx && role.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      return NextResponse.json({ error: 'Role name already exists' }, { status: 400 });
    }
    db.roles[idx].name = name;
  }

  if (typeof data.description === 'string') {
    db.roles[idx].description = data.description.trim();
  }

  if (Array.isArray(data.permissionIds)) {
    const permissionIds = data.permissionIds.filter((permissionId: unknown): permissionId is string => typeof permissionId === 'string');
    const validPermissionIds = new Set(db.permissions.map((permission) => permission.id));
    const hasUnknownPermission = permissionIds.some((permissionId: string) => !validPermissionIds.has(permissionId));
    if (hasUnknownPermission) {
      return NextResponse.json({ error: 'One or more permissions are invalid' }, { status: 400 });
    }
    db.roles[idx].permissionIds = permissionIds;
  }

  db.roles[idx].updatedAt = new Date().toISOString();
  writeDb(db);
  return NextResponse.json(db.roles[idx]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();

  const role = db.roles.find((item) => item.id === id);
  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  }

  if (role.isSystem) {
    return NextResponse.json({ error: 'System roles cannot be deleted' }, { status: 400 });
  }

  const isRoleInUse = db.adminAccounts.some((account) => account.roleId === id);
  if (isRoleInUse) {
    return NextResponse.json({ error: 'Role is assigned to one or more users' }, { status: 400 });
  }

  db.roles = db.roles.filter((item) => item.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
