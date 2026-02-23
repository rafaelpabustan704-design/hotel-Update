import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type {
  Reservation, DiningReservation, ManagedRoom, RoomType, HotelSettings,
  SiteSettings, NavigationItem, HeroContent, AboutContent,
  RestaurantItem, SignatureDish, DiningHighlight,
  AmenityItem, AvailabilityContent, ContactItem, SectionHeaders,
  AdminAccount,
} from '@/types';

export interface DbSchema {
  reservations: Reservation[];
  diningReservations: DiningReservation[];
  rooms: ManagedRoom[];
  roomTypes: RoomType[];
  settings: HotelSettings;
  adminAccounts: AdminAccount[];
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
  heroContent: HeroContent;
  aboutContent: AboutContent;
  restaurants: RestaurantItem[];
  signatureDishes: SignatureDish[];
  diningHighlights: DiningHighlight[];
  amenities: AmenityItem[];
  availabilityContent: AvailabilityContent;
  contactItems: ContactItem[];
  sectionHeaders: SectionHeaders;
}

const DB_PATH = join(process.cwd(), 'db.json');

export function readDb(): DbSchema {
  const raw = readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DbSchema;
}

export function writeDb(data: DbSchema): void {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
