import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.permissions);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();

  const name = String(data.name ?? '').trim();
  const tabs = Array.isArray(data.tabs)
    ? data.tabs.filter((tab: unknown): tab is string => typeof tab === 'string' && tab.trim().length > 0).map((tab: string) => tab.trim())
    : [];
  const legacyTab = String(data.tab ?? '').trim();
  const normalizedTabs = tabs.length > 0 ? [...new Set<string>(tabs)] : (legacyTab ? [legacyTab] : []);
  const action = String(data.action ?? 'manage').trim();
  const code = String(data.code ?? `${normalizedTabs.join('+') || 'permission'}:${action}`).trim();

  if (normalizedTabs.length === 0) {
    return NextResponse.json({ error: 'At least one tab is required' }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: 'Permission code is required' }, { status: 400 });
  }

  const duplicate = db.permissions.some((permission) => permission.code.toLowerCase() === code.toLowerCase());
  if (duplicate) {
    return NextResponse.json({ error: 'Permission code already exists' }, { status: 400 });
  }

  const permission = {
    id: randomUUID(),
    name: name || code,
    code,
    tabs: normalizedTabs,
    tab: normalizedTabs[0],
    action: (action || 'manage') as 'read' | 'create' | 'update' | 'delete' | 'manage',
    description: String(data.description ?? '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.permissions.push(permission);
  writeDb(db);
  return NextResponse.json(permission, { status: 201 });
}
