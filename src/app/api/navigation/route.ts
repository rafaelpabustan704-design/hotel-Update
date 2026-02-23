import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST, PUT } = createCollectionRoutes('navigation', (body) => ({
  label: String(body.label ?? ''),
  href: String(body.href ?? ''),
}), { bulkPut: true });
