'use client';

import { Hotel } from 'lucide-react';
import Link from 'next/link';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveTemplate } from '@/utils/template';

export default function Footer() {
  const { siteSettings, navigation } = useLandingContent();
  const displayName = siteSettings.name || 'Grand Horizon Hotel & Resort';
  const shortName = displayName.split(' ').slice(0, 2).join(' ');

  return (
    <footer className="bg-hotel-900 dark:bg-dark-bg py-10 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {siteSettings.footerText && (
          <p className="text-center text-sm text-hotel-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            {resolveTemplate(siteSettings.footerText, displayName)}
          </p>
        )}

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt={displayName} className="h-6 w-6 object-contain" />
            ) : (
              <Hotel className="h-6 w-6 text-gold-400 transition-transform group-hover:scale-110" />
            )}
            <span className="font-serif text-lg font-bold text-white">{shortName}</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {navigation.map((item) => (
              <a key={item.id} href={item.href} className="text-hotel-400 hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <p className="text-sm text-hotel-500">
            &copy; {new Date().getFullYear()} {displayName}
          </p>
        </div>
      </div>
    </footer>
  );
}
