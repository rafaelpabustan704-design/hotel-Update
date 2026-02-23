import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('contactItems', (body) => ({
  icon: String(body.icon ?? 'Star'),
  title: String(body.title ?? ''),
  lines: Array.isArray(body.lines) ? body.lines.map(String) : [],
}));
