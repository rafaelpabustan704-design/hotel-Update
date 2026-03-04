import { createCollectionRoutes } from '@/lib/api-helpers';

export const { GET, POST } = createCollectionRoutes('contactSubmissions', (body) => ({
    fullName: String(body.fullName ?? ''),
    email: String(body.email ?? ''),
    phone: String(body.phone ?? ''),
    subject: String(body.subject ?? ''),
    message: String(body.message ?? ''),
    source: (body.source === 'phone' ? 'phone' : 'form') as 'form' | 'phone',
    createdAt: new Date().toISOString(),
}));
