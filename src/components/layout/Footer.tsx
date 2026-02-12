'use client';

import { Hotel } from 'lucide-react';
import Link from 'next/link';
import { NAV_ITEMS } from '@/constants/hotel';

export default function Footer() {
  return (
    <footer className="bg-hotel-900 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Divider */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <Hotel className="h-6 w-6 text-gold-400 transition-transform group-hover:scale-110" />
            <span className="font-serif text-lg font-bold text-white">Grand Horizon</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-hotel-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-hotel-500">
            &copy; {new Date().getFullYear()} Grand Horizon Hotel
          </p>
        </div>
      </div>
    </footer>
  );
}
