'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Hotel } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/hotel';

interface NavbarProps {
  onBookNow: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname === '/admin';
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On non-home pages, always show solid navbar
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Hotel
              className={`h-8 w-8 transition-all group-hover:scale-110 ${
                isTransparent ? 'text-gold-400' : 'text-gold-600'
              }`}
            />
            <div>
              <span
                className={`block font-serif text-xl font-bold leading-tight transition-colors ${
                  isTransparent ? 'text-white' : 'text-hotel-900'
                }`}
              >
                Grand Horizon
              </span>
              <span
                className={`block text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  isTransparent ? 'text-white/60' : 'text-hotel-500'
                }`}
              >
                Hotel & Resort
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {!isAdmin && (
              <>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`text-sm font-medium transition-colors ${
                      isTransparent
                        ? 'text-white/80 hover:text-white'
                        : 'text-hotel-700 hover:text-gold-600'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </>
            )}
            {!isAdmin && (
              <button
                onClick={onBookNow}
                className="rounded-full bg-gold-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Book Now
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden transition-colors ${
              isTransparent ? 'text-white' : 'text-hotel-700'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-hotel-100 px-4 pb-6 pt-2 space-y-1 shadow-lg">
          {!isAdmin && (
            <>
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-hotel-700 hover:text-gold-600 hover:bg-hotel-50 rounded-lg py-3 px-3 transition-colors"
                >
                  {item}
                </a>
              ))}
            </>
          )}
          {!isAdmin && (
            <div className="pt-3">
              <button
                onClick={() => {
                  onBookNow();
                  setMobileOpen(false);
                }}
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
