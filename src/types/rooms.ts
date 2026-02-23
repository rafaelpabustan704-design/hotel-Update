export interface RoomType {
  id: string;
  name: string;
  totalRooms: number;
  maxAdults: number;
  maxChildren: number;
  color: string;
  perks: string[];
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
