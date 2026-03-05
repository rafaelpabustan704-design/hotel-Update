import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// GET — return all archived room reservations
export async function GET() {
    const db = readDb();
    const archived = db.archivedReservations ?? [];
    return NextResponse.json(archived);
}

// POST — archive all past room reservations (checkOut <= today)
export async function POST() {
    const db = readDb();
    const today = new Date().toISOString().slice(0, 10);

    const past = db.reservations.filter((r) => r.checkOut <= today);
    const active = db.reservations.filter((r) => r.checkOut > today);

    if (!db.archivedReservations) db.archivedReservations = [];
    db.archivedReservations.push(...past);
    db.reservations = active;
    writeDb(db);

    return NextResponse.json({ archived: past.length, remaining: active.length });
}
