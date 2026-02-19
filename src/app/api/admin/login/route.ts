import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const db = readDb();

  const match = db.adminAccounts.find(
    (a) => a.username === username && a.password === password,
  );

  if (match) {
    return NextResponse.json({ success: true, username: match.username });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
