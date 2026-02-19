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
  id: number | string;
  name: string;
  roomTypeKey: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  features: string[];
  specs: { icon: ComponentType<{ className?: string }>; label: string; value: string }[];
  inclusions: string[];
}

export interface RoomType {
  id: string;
  name: string;
  totalRooms: number;
  maxAdults: number;
  maxChildren: number;
  color: string;
  createdAt: string;
}

export interface ManagedRoom {
  id: string;
  name: string;
  roomTypeId: string;
  price: number;
  maxPax: number;
  description: string;
  longDescription: string;
  tagline: string;
  bedType: string;
  bedQty: number;
  extraBedType: string;
  extraBedQty: number;
  roomSize: string;
  view: string;
  amenities: string[];
  inclusions: string[];
  images: string[];
  createdAt: string;
}

export interface HotelSettings {
  name: string;
  address: string;
}
