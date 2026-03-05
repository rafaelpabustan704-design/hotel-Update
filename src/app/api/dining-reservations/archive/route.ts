import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// GET — return all archived dining reservations
export async function GET() {
    const db = readDb();
    const archived = db.archivedDiningReservations ?? [];
    return NextResponse.json(archived);
}

// POST — archive all past dining reservations (date < today)
export async function POST() {
    const db = readDb();
    const today = new Date().toISOString().slice(0, 10);

    const past = db.diningReservations.filter((r) => r.date < today);
    const active = db.diningReservations.filter((r) => r.date >= today);

    if (!db.archivedDiningReservations) db.archivedDiningReservations = [];
    db.archivedDiningReservations.push(...past);
    db.diningReservations = active;
    writeDb(db);

    return NextResponse.json({ archived: past.length, remaining: active.length });
}
