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

  const tab = String(data.tab ?? '').trim();
  const action = String(data.action ?? 'manage').trim();
  const code = String(data.code ?? `${tab}:${action}`).trim();

  if (!tab) {
    return NextResponse.json({ error: 'Permission tab is required' }, { status: 400 });
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
    code,
    tab,
    action: (action || 'manage') as 'read' | 'create' | 'update' | 'delete' | 'manage',
    description: String(data.description ?? '').trim(),
    createdAt: new Date().toISOString(),
  };

  db.permissions.push(permission);
  writeDb(db);
  return NextResponse.json(permission, { status: 201 });
}
