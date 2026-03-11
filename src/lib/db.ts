import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type {
  Reservation, DiningReservation, ManagedRoom, RoomType, HotelSettings,
  SiteSettings, NavigationItem, HeroContent, AboutContent,
  RestaurantItem, SignatureDish, DiningHighlight,
  AmenityItem, AvailabilityContent, ContactItem, ContactSubmission, SectionHeaders,
  AdminAccount, Role, Permission,
} from '@/types';
import { ensureRbacCollections } from './admin-rbac';

export interface DbSchema {
  reservations: Reservation[];
  diningReservations: DiningReservation[];
  archivedReservations: Reservation[];
  archivedDiningReservations: DiningReservation[];
  rooms: ManagedRoom[];
  roomTypes: RoomType[];
  settings: HotelSettings;
  adminAccounts: AdminAccount[];
  roles: Role[];
  permissions: Permission[];
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
  contactSubmissions: ContactSubmission[];
  archivedContactSubmissions: ContactSubmission[];
  sectionHeaders: SectionHeaders;
}

const DB_PATH = join(process.cwd(), 'db.json');

export function readDb(): DbSchema {
  const raw = readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as DbSchema;
  const { changed } = ensureRbacCollections(parsed);
  if (changed) {
    writeDb(parsed);
  }
  return parsed;
}

export function writeDb(data: DbSchema): void {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
