import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { readDb } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = readDb();
    const name = db.siteSettings?.name || 'Grand Horizon Hotel & Resort';
    return {
      title: name,
      description: `Experience timeless elegance at ${name}. Luxury rooms, world-class dining, and unmatched hospitality.`,
      icons: db.siteSettings?.favicon ? { icon: db.siteSettings.favicon } : undefined,
    };
  } catch {
    return {
      title: 'Grand Horizon Hotel & Resort',
      description: 'Experience timeless elegance at Grand Horizon Hotel. Luxury rooms, world-class dining, and unmatched hospitality.',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-dark-bg text-hotel-900 dark:text-hotel-100 transition-colors">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
