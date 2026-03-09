'use client';

import { Hotel, Moon, Sun } from 'lucide-react';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { useTheme } from '@/hooks/ThemeContext';
import type { AdminTab } from './tabs';
import Hero from '@/features/Hero';
import About from '@/features/About';
import Rooms from '@/features/Rooms';
import Dining from '@/features/Dining';
import Amenities from '@/features/Amenities';
import Availability from '@/features/Availability';
import Contact from '@/features/Contact';
import Footer from '@/components/layout/Footer';

const noop = () => {};

function FullLandingPagePreview() {
  const { siteSettings, navigation } = useLandingContent();
  const { theme, toggleTheme } = useTheme();
  const displayName = siteSettings.name || 'Grand Horizon Hotel & Resort';
  const shortName = displayName.split(' ').slice(0, 2).join(' ');
  const subtitle = displayName.split(' ').slice(2).join(' ') || 'Hotel & Resort';

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <div className="sticky top-0 z-20 border-b border-hotel-100 dark:border-dark-border bg-white/95 dark:bg-dark-card/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              {siteSettings.logo ? (
                <img src={siteSettings.logo} alt={displayName} className="h-8 w-8 object-contain" />
              ) : (
                <Hotel className="h-8 w-8 text-gold-600" />
              )}
              <div>
                <span className="block font-serif text-xl font-bold leading-tight text-hotel-900 dark:text-white">{shortName}</span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-hotel-500 dark:text-hotel-400">{subtitle}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <span key={item.id} className="text-sm font-medium text-hotel-700 dark:text-hotel-300">
                  {item.label}
                </span>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full text-hotel-500 dark:text-hotel-300 hover:text-hotel-900 dark:hover:text-white hover:bg-hotel-100 dark:hover:bg-hotel-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={noop}
                className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <main>
        <Hero onBookNow={noop} onReserveTable={noop} />
        <About />
        <Rooms onBookNow={noop} />
        <Dining onReserveTable={noop} />
        <Availability onBookNow={noop} />
        <Amenities />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

function NavbarPreview() {
  const { siteSettings, navigation } = useLandingContent();
  const displayName = siteSettings.name || 'Grand Horizon Hotel & Resort';
  const shortName = displayName.split(' ').slice(0, 2).join(' ');
  const subtitle = displayName.split(' ').slice(2).join(' ') || 'Hotel & Resort';

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Light / scrolled variant */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2">Scrolled / Light</p>
        <nav className="rounded-xl bg-white dark:bg-dark-card shadow-md border border-hotel-100 dark:border-dark-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-2">
                {siteSettings.logo ? (
                  <img src={siteSettings.logo} alt={displayName} className="h-8 w-8 object-contain" />
                ) : (
                  <Hotel className="h-8 w-8 text-gold-600" />
                )}
                <div>
                  <span className="block font-serif text-xl font-bold leading-tight text-hotel-900 dark:text-white">{shortName}</span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-hotel-500 dark:text-hotel-400">{subtitle}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {navigation.map((item) => (
                  <span key={item.id} className="text-sm font-medium text-hotel-700 dark:text-hotel-300">{item.label}</span>
                ))}
                <span className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25">Book Now</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Transparent / hero variant */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2">Transparent / Over Hero</p>
        <nav className="rounded-xl bg-hotel-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-hotel-900/80" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-2">
                {siteSettings.logo ? (
                  <img src={siteSettings.logo} alt={displayName} className="h-8 w-8 object-contain" />
                ) : (
                  <Hotel className="h-8 w-8 text-gold-400" />
                )}
                <div>
                  <span className="block font-serif text-xl font-bold leading-tight text-white">{shortName}</span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-white/60">{subtitle}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {navigation.map((item) => (
                  <span key={item.id} className="text-sm font-medium text-white/80">{item.label}</span>
                ))}
                <span className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25">Book Now</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

interface PreviewEntry {
  label: string;
  render: () => React.ReactNode;
}

export const PREVIEW_MAP: Partial<Record<AdminTab, PreviewEntry>> = {
  hero: {
    label: 'Hero Section',
    render: () => <Hero onBookNow={noop} onReserveTable={noop} />,
  },
  about: {
    label: 'About Section',
    render: () => <About />,
  },
  'room-types': {
    label: 'Rooms Section',
    render: () => <Rooms onBookNow={noop} />,
  },
  'manage-rooms': {
    label: 'Rooms Section',
    render: () => <Rooms onBookNow={noop} />,
  },
  restaurants: {
    label: 'Dining & Cuisine',
    render: () => <Dining />,
  },
  'signature-dishes': {
    label: 'Dining & Cuisine',
    render: () => <Dining />,
  },
  'dining-highlights': {
    label: 'Dining & Cuisine',
    render: () => <Dining />,
  },
  'cms-amenities': {
    label: 'Amenities Section',
    render: () => <Amenities />,
  },
  'availability-content': {
    label: 'Availability Section',
    render: () => <Availability onBookNow={noop} />,
  },
  contact: {
    label: 'Contact Section',
    render: () => <Contact />,
  },
  navigation: {
    label: 'Navigation Bar',
    render: () => <NavbarPreview />,
  },
  'site-settings': {
    label: 'Full Page',
    render: () => <FullLandingPagePreview />,
  },
  'section-headers': {
    label: 'All Sections',
    render: () => (
      <>
        <Rooms onBookNow={noop} />
        <Dining />
        <Amenities />
        <Contact />
      </>
    ),
  },
};
