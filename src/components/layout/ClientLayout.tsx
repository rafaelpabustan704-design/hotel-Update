'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/hooks/ThemeContext';
import PublicLayout from './PublicLayout';

export { useBookingUI } from './PublicLayout';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <PublicLayout>{children}</PublicLayout>
    </ThemeProvider>
  );
}
