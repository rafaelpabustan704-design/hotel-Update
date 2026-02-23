import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('reservations', (body) => ({
  fullName: String(body.fullName ?? ''),
  email: String(body.email ?? ''),
  phone: String(body.phone ?? ''),
  checkIn: String(body.checkIn ?? ''),
  checkOut: String(body.checkOut ?? ''),
  roomType: String(body.roomType ?? ''),
  adults: Number(body.adults) || 0,
  children: Number(body.children) || 0,
  specialRequests: String(body.specialRequests ?? ''),
  createdAt: new Date().toISOString(),
}));
