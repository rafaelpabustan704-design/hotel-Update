import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const db = readDb();

  const idx = db.permissions.findIndex((permission) => permission.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
  }

  if (typeof data.code === 'string') {
    const code = data.code.trim();
    if (!code) {
      return NextResponse.json({ error: 'Permission code is required' }, { status: 400 });
    }
    const duplicate = db.permissions.some(
      (permission, permissionIdx) => permissionIdx !== idx && permission.code.toLowerCase() === code.toLowerCase(),
    );
    if (duplicate) {
      return NextResponse.json({ error: 'Permission code already exists' }, { status: 400 });
    }
    db.permissions[idx].code = code;
  }

  if (typeof data.name === 'string') {
    const name = data.name.trim();
    if (!name) {
      return NextResponse.json({ error: 'Permission name is required' }, { status: 400 });
    }
    db.permissions[idx].name = name;
  }

  if (Array.isArray(data.tabs)) {
    const tabs = data.tabs
      .filter((tab: unknown): tab is string => typeof tab === 'string' && tab.trim().length > 0)
      .map((tab: string) => tab.trim());
    if (tabs.length === 0) {
      return NextResponse.json({ error: 'At least one tab is required' }, { status: 400 });
    }
    const uniqueTabs = [...new Set<string>(tabs)];
    db.permissions[idx].tabs = uniqueTabs;
    db.permissions[idx].tab = uniqueTabs[0];
  } else if (typeof data.tab === 'string') {
    const tab = data.tab.trim();
    if (!tab) {
      return NextResponse.json({ error: 'Permission tab is required' }, { status: 400 });
    }
    db.permissions[idx].tabs = [tab];
    db.permissions[idx].tab = tab;
  }

  if (typeof data.action === 'string') {
    db.permissions[idx].action = data.action;
  }

  if (typeof data.description === 'string') {
    db.permissions[idx].description = data.description.trim();
  }

  db.permissions[idx].updatedAt = new Date().toISOString();

  writeDb(db);
  return NextResponse.json(db.permissions[idx]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDb();

  const exists = db.permissions.some((permission) => permission.id === id);
  if (!exists) {
    return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
  }

  db.permissions = db.permissions.filter((permission) => permission.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
