'use client';

import { ChevronDown } from 'lucide-react';
import { TRUST_BADGES } from '@/constants/hotel';

interface HeroProps {
  onBookNow: () => void;
  onReserveTable: () => void;
}

export default function Hero({ onBookNow, onReserveTable }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-hotel-900">
      {/* Background image */}
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-hotel-900/40 to-hotel-900/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <p className="mb-6 inline-block rounded-full border border-gold-400/40 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-sm">
          Luxury Redefined
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          Experience<br />
          <span className="text-gold-400">Timeless Elegance</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/80 mb-10 leading-relaxed">
          Nestled along the coast, Grand Horizon Hotel offers an unparalleled blend of luxury,
          comfort, and world-class hospitality. Your perfect escape awaits.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookNow}
            className="rounded-full bg-gold-600 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-2xl shadow-gold-600/30 transition-all hover:bg-gold-500 hover:-translate-y-1 hover:shadow-gold-500/40 active:translate-y-0"
          >
            Reserve Your Stay
          </button>
          <button
            onClick={() => onReserveTable()}
            className="rounded-full border-2 border-white/30 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
          >
            Reserve a Table
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-1.5 text-white/60">
              <badge.icon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 hover:text-white transition-colors"
      >
        <ChevronDown className="h-8 w-8" />
      </a>
    </section>
  );
}
