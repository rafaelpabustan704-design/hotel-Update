import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Reservation, DiningReservation, ManagedRoom, RoomType, HotelSettings } from '@/utils/types';
import type { AdminAccount } from '@/hooks/useAdminAuth';

export interface DbSchema {
  reservations: Reservation[];
  diningReservations: DiningReservation[];
  rooms: ManagedRoom[];
  roomTypes: RoomType[];
  settings: HotelSettings;
  adminAccounts: AdminAccount[];
}

const DB_PATH = join(process.cwd(), 'db.json');

export function readDb(): DbSchema {
  const raw = readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DbSchema;
}

export function writeDb(data: DbSchema): void {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
