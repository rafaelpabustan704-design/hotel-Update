import type { ComponentType } from 'react';

export interface Reservation {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  adults: number;
  children: number;
  specialRequests: string;
  createdAt: string;
}

export interface DiningReservation {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  restaurant: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  specialRequests: string;
  createdAt: string;
}

export interface RoomDetail {
  id: number;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  features: string[];
  specs: { icon: ComponentType<{ className?: string }>; label: string; value: string }[];
  inclusions: string[];
}
