import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('roomTypes', (body) => ({
  name: String(body.name ?? ''),
  totalRooms: Number(body.totalRooms) || 1,
  maxAdults: Number(body.maxAdults) || 1,
  maxChildren: Number(body.maxChildren) || 0,
  color: String(body.color ?? 'blue'),
  perks: Array.isArray(body.perks) ? body.perks.map(String) : [],
  createdAt: new Date().toISOString(),
}));
