import type { ComponentType } from 'react';
import {
  Bath, BedDouble, Car, ChefHat, Coffee, Dumbbell, Eye,
  Fence, Lock, Maximize, Ruler, Snowflake, Sofa, Tv,
  UserCheck, Users, UtensilsCrossed, Waves, Wifi, Wine,
} from 'lucide-react';

export const FEATURE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  wifi: Wifi, coffee: Coffee, tv: Tv, bath: Bath,
  guests: Users, size: Maximize, minibar: Wine,
  roomservice: UtensilsCrossed, airconditioning: Snowflake,
  safe: Lock, loungeaccess: Sofa, butlerservice: UserCheck,
  privateterrace: Fence, balcony: Maximize, kitchen: ChefHat,
  jacuzzi: Waves,
};

export const FEATURE_LABELS: Record<string, string> = {
  wifi: 'WiFi', coffee: 'Coffee', tv: 'TV', bath: 'Bath',
  guests: 'Family', size: 'Spacious', minibar: 'Mini Bar',
  roomservice: 'Room Service', airconditioning: 'A/C',
  safe: 'Safe', loungeaccess: 'Lounge', butlerservice: 'Butler',
  privateterrace: 'Terrace', balcony: 'Balcony',
  kitchen: 'Kitchen', jacuzzi: 'Jacuzzi',
};

export const ROOM_COLORS: Record<string, { hex: string; hexBg: string; hexText: string }> = {
  'Deluxe Room':        { hex: '#3b82f6', hexBg: '#eff6ff', hexText: '#1d4ed8' },
  'Executive Suite':    { hex: '#a855f7', hexBg: '#faf5ff', hexText: '#7e22ce' },
  'Presidential Suite': { hex: '#f59e0b', hexBg: '#fffbeb', hexText: '#b45309' },
};

const ROOM_COLOR_FALLBACK = { hex: '#6b7280', hexBg: '#f9fafb', hexText: '#374151' };

export function getRoomColor(roomType: string) {
  return ROOM_COLORS[roomType] || ROOM_COLOR_FALLBACK;
}

export const RESTAURANT_COLORS: Record<string, { hex: string; hexBg: string; hexText: string }> = {
  'The Ocean Terrace': { hex: '#06b6d4', hexBg: '#ecfeff', hexText: '#0e7490' },
  'Sakura Garden':     { hex: '#ec4899', hexBg: '#fdf2f8', hexText: '#be185d' },
  'La Dolce Vita':     { hex: '#f97316', hexBg: '#fff7ed', hexText: '#c2410c' },
};

const RESTAURANT_COLOR_FALLBACK = { hex: '#6b7280', hexBg: '#f9fafb', hexText: '#374151' };

export function getRestaurantColor(restaurant: string) {
  return RESTAURANT_COLORS[restaurant] || RESTAURANT_COLOR_FALLBACK;
}

export const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '18:00', '18:30', '19:00', '19:30', '20:00',
  '20:30', '21:00', '21:30', '22:00',
];
