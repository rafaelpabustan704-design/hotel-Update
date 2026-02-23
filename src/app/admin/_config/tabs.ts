import {
  BedDouble, UtensilsCrossed, Layers, DoorOpen,
  Sparkles, Image, ChefHat, Flame, CalendarDays,
  Phone, Palette, Navigation, Globe, Users, Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminTab =
  | 'rooms' | 'dining'
  | 'room-types' | 'manage-rooms'
  | 'hero' | 'about' | 'restaurants' | 'signature-dishes'
  | 'dining-highlights' | 'cms-amenities' | 'availability-content' | 'contact'
  | 'site-settings' | 'navigation' | 'section-headers' | 'settings';

export interface TabMeta {
  id: AdminTab;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  section: 'reservations' | 'management' | 'landing' | 'system';
}

export const TABS: TabMeta[] = [
  { id: 'rooms', label: 'Room Reservations', title: 'Room Reservations', description: 'View and manage all room reservations', icon: BedDouble, section: 'reservations' },
  { id: 'dining', label: 'Dining Reservations', title: 'Dining Reservations', description: 'View and manage all table reservations', icon: UtensilsCrossed, section: 'reservations' },

  { id: 'room-types', label: 'Room Types', title: 'Room Types', description: 'Create and manage room type categories', icon: Layers, section: 'management' },
  { id: 'manage-rooms', label: 'Rooms', title: 'Rooms', description: 'Manage individual rooms and their details', icon: DoorOpen, section: 'management' },

  { id: 'hero', label: 'Hero Section', title: 'Hero Section', description: 'Configure the hero banner content', icon: Sparkles, section: 'landing' },
  { id: 'about', label: 'About Section', title: 'About Section', description: 'Edit the About section text, images, and stats', icon: Image, section: 'landing' },
  { id: 'restaurants', label: 'Restaurants', title: 'Restaurants', description: 'Manage restaurant cards shown on the landing page', icon: UtensilsCrossed, section: 'landing' },
  { id: 'signature-dishes', label: 'Signature Dishes', title: 'Signature Dishes', description: 'Manage the signature dishes slider', icon: ChefHat, section: 'landing' },
  { id: 'dining-highlights', label: 'Why Dine With Us', title: 'Why Dine With Us', description: 'Manage the "Why Dine With Us" feature cards', icon: Flame, section: 'landing' },
  { id: 'cms-amenities', label: 'Amenities', title: 'Amenities', description: 'Manage amenity cards', icon: Sparkles, section: 'landing' },
  { id: 'availability-content', label: 'Availability', title: 'Availability Section', description: 'Configure the availability section text', icon: CalendarDays, section: 'landing' },
  { id: 'contact', label: 'Contact', title: 'Contact Section', description: 'Manage contact information cards', icon: Phone, section: 'landing' },

  { id: 'site-settings', label: 'Site Settings', title: 'Site Settings', description: 'Site name, logo, footer, and theme colors', icon: Palette, section: 'system' },
  { id: 'navigation', label: 'Navigation', title: 'Navigation Menu', description: 'Configure the navigation menu items', icon: Navigation, section: 'system' },
  { id: 'section-headers', label: 'Section Headers', title: 'Section Headers', description: 'Edit section labels, titles, and descriptions', icon: Globe, section: 'system' },
  { id: 'settings', label: 'Admin Accounts', title: 'Admin Accounts', description: 'Manage admin accounts', icon: Users, section: 'system' },
];

export const SECTION_LABELS: Record<TabMeta['section'], string> = {
  reservations: 'Reservations',
  management: 'Management',
  landing: 'Landing Page',
  system: 'System',
};

void Settings;
