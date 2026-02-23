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
