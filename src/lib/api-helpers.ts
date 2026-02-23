import { NextResponse } from 'next/server';
import { readDb, writeDb, type DbSchema } from './db';
import { randomUUID } from 'crypto';

type CollectionKey = {
  [K in keyof DbSchema]: DbSchema[K] extends Array<infer U>
    ? U extends { id: string } ? K : never
    : never;
}[keyof DbSchema];

type ItemOf<K extends CollectionKey> = DbSchema[K] extends Array<infer U> ? U : never;

/**
 * Factory for collection list routes: GET (all) + POST (create).
 * Optionally supports PUT for bulk replacement (e.g. navigation reordering).
 */
export function createCollectionRoutes<K extends CollectionKey>(
  key: K,
  buildNew: (body: Record<string, unknown>) => Omit<ItemOf<K>, 'id'>,
  options?: { bulkPut?: boolean },
) {
  const GET = async () => {
    const db = readDb();
    return NextResponse.json(db[key]);
  };

  const POST = async (request: Request) => {
    const data = await request.json();
    const db = readDb();
    const item = { id: randomUUID(), ...buildNew(data) } as ItemOf<K>;
    (db[key] as ItemOf<K>[]).push(item);
    writeDb(db);
    return NextResponse.json(item, { status: 201 });
  };

  if (options?.bulkPut) {
    const PUT = async (request: Request) => {
      const data = await request.json();
      const db = readDb();
      if (Array.isArray(data)) {
        (db[key] as unknown[]) = data;
      }
      writeDb(db);
      return NextResponse.json(db[key]);
    };
    return { GET, POST, PUT };
  }

  return { GET, POST };
}

/**
 * Factory for collection item routes: PUT (update) + DELETE (remove).
 */
export function createItemRoutes<K extends CollectionKey>(key: K) {
  const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const data = await request.json();
    const db = readDb();
    const arr = db[key] as ItemOf<K>[];
    const idx = arr.findIndex((item) => (item as { id: string }).id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    arr[idx] = { ...(arr[idx] as object), ...data, id } as ItemOf<K>;
    writeDb(db);
    return NextResponse.json(arr[idx]);
  };

  const DELETE = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const db = readDb();
    (db[key] as Array<{ id: string }>) = (db[key] as Array<{ id: string }>).filter((item) => item.id !== id);
    writeDb(db);
    return NextResponse.json({ success: true });
  };

  return { PUT, DELETE };
}

type SingletonKey = {
  [K in keyof DbSchema]: DbSchema[K] extends Array<unknown> ? never : K;
}[keyof DbSchema];

/**
 * Factory for singleton routes: GET + PUT (merge).
 */
export function createSingletonRoutes<K extends SingletonKey>(key: K) {
  const GET = async () => {
    const db = readDb();
    return NextResponse.json(db[key]);
  };

  const PUT = async (request: Request) => {
    const data = await request.json();
    const db = readDb();
    db[key] = { ...db[key] as object, ...data } as DbSchema[K];
    writeDb(db);
    return NextResponse.json(db[key]);
  };

  return { GET, PUT };
}
