import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('signatureDishes', (body) => ({
  image: String(body.image ?? ''),
  title: String(body.title ?? ''),
  description: String(body.description ?? ''),
}));
