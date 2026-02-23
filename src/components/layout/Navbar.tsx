'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Hotel, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/ThemeContext';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface NavbarProps {
  onBookNow: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname === '/admin';
  const isHome = pathname === '/';
  const { theme, toggleTheme } = useTheme();
  const { siteSettings, navigation } = useLandingContent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled && !mobileOpen;
  const displayName = siteSettings.name || 'Grand Horizon Hotel & Resort';
  const shortName = displayName.split(' ').slice(0, 2).join(' ');
  const subtitle = displayName.split(' ').slice(2).join(' ') || 'Hotel & Resort';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 dark:bg-dark-card/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt={displayName} className="h-8 w-8 object-contain" />
            ) : (
              <Hotel className={`h-8 w-8 transition-all group-hover:scale-110 ${isTransparent ? 'text-gold-400' : 'text-gold-600'}`} />
            )}
            <div>
              <span className={`block font-serif text-xl font-bold leading-tight transition-colors ${isTransparent ? 'text-white' : 'text-hotel-900 dark:text-white'}`}>
                {shortName}
              </span>
              <span className={`block text-[10px] uppercase tracking-[0.25em] transition-colors ${isTransparent ? 'text-white/60' : 'text-hotel-500 dark:text-hotel-400'}`}>
                {subtitle}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!isAdmin && navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-hotel-700 dark:text-hotel-300 hover:text-gold-600'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                isTransparent
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-hotel-500 dark:text-hotel-400 hover:text-hotel-900 dark:hover:text-white hover:bg-hotel-100 dark:hover:bg-hotel-800'
              }`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {!isAdmin && (
              <button
                onClick={onBookNow}
                className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
              >
                Book Now
              </button>
            )}
          </div>

          <button
            className={`md:hidden transition-colors ${isTransparent ? 'text-white' : 'text-hotel-700 dark:text-hotel-300'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-dark-card border-t border-hotel-100 dark:border-dark-border px-4 pb-6 pt-2 space-y-1 shadow-lg">
          {!isAdmin && navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-hotel-700 dark:text-hotel-300 hover:text-gold-600 hover:bg-hotel-50 dark:hover:bg-hotel-800 rounded-lg py-3 px-3 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300 hover:text-gold-600 hover:bg-hotel-50 dark:hover:bg-hotel-800 rounded-lg py-3 px-3 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          {!isAdmin && (
            <div className="pt-3">
              <button
                onClick={() => { onBookNow(); setMobileOpen(false); }}
                className="w-full rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gold-600/25"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
