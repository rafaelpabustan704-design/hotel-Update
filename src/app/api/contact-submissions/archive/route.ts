import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// GET — return all archived contact submissions
export async function GET() {
    const db = readDb();
    const archived = db.archivedContactSubmissions ?? [];
    return NextResponse.json(archived);
}

// POST — auto-archive contact submissions older than 14 days
export async function POST() {
    const db = readDb();
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const old = db.contactSubmissions.filter((s) => s.createdAt < cutoff);
    const recent = db.contactSubmissions.filter((s) => s.createdAt >= cutoff);

    if (old.length === 0) {
        return NextResponse.json({ archived: 0, remaining: recent.length });
    }

    if (!db.archivedContactSubmissions) db.archivedContactSubmissions = [];
    db.archivedContactSubmissions.push(...old);
    db.contactSubmissions = recent;
    writeDb(db);

    return NextResponse.json({ archived: old.length, remaining: recent.length });
}
