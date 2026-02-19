import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.adminAccounts);
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

  const account = {
    id: randomUUID(),
    fullName: String(data.fullName).trim(),
    email: String(data.email ?? '').trim(),
    username: String(data.username),
    password: String(data.password),
    createdAt: new Date().toISOString(),
  };

  db.adminAccounts.push(account);
  writeDb(db);
  return NextResponse.json(account, { status: 201 });
}
