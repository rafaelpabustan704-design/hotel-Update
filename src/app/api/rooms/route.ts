import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('rooms', (body) => ({
  name: String(body.name ?? ''),
  roomTypeId: String(body.roomTypeId ?? ''),
  price: Number(body.price) || 0,
  maxPax: Number(body.maxPax) || 1,
  description: String(body.description ?? ''),
  longDescription: String(body.longDescription ?? ''),
  tagline: String(body.tagline ?? ''),
  bedType: String(body.bedType ?? ''),
  bedQty: Number(body.bedQty) || 1,
  extraBedType: String(body.extraBedType ?? ''),
  extraBedQty: Number(body.extraBedQty) || 0,
  roomSize: String(body.roomSize ?? ''),
  view: String(body.view ?? ''),
  amenities: Array.isArray(body.amenities) ? body.amenities.map(String) : [],
  inclusions: Array.isArray(body.inclusions) ? body.inclusions.map(String) : [],
  images: Array.isArray(body.images) ? body.images.map(String) : [],
  createdAt: new Date().toISOString(),
}));
