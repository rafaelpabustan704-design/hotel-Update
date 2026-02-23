import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('restaurants', (body) => ({
  name: String(body.name ?? ''),
  cuisine: String(body.cuisine ?? ''),
  hours: String(body.hours ?? ''),
  description: String(body.description ?? ''),
  image: String(body.image ?? ''),
  tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
  buttonText: String(body.buttonText ?? 'Reserve a Table'),
}));
