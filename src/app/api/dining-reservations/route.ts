import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('diningReservations', (body) => ({
  fullName: String(body.fullName ?? ''),
  email: String(body.email ?? ''),
  phone: String(body.phone ?? ''),
  restaurant: String(body.restaurant ?? ''),
  date: String(body.date ?? ''),
  time: String(body.time ?? ''),
  adults: Number(body.adults) || 0,
  children: Number(body.children) || 0,
  specialRequests: String(body.specialRequests ?? ''),
  createdAt: new Date().toISOString(),
}));
