import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('amenities', (body) => ({
  icon: String(body.icon ?? 'Star'),
  title: String(body.title ?? ''),
  description: String(body.description ?? ''),
}));
