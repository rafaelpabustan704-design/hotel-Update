'use client';

import { useState, useEffect, useCallback } from 'react';
import { UtensilsCrossed, Clock, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { RESTAURANTS, FOOD_GALLERY, DINING_HIGHLIGHTS } from '@/constants/hotel';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface DiningProps {
  onReserveTable?: (restaurant: string) => void;
}

export default function Dining({ onReserveTable }: DiningProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = FOOD_GALLERY.length;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % total) + total) % total);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section id="dining" className="scroll-mt-20 py-24 bg-white dark:bg-dark-card transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Food photo carousel ---- */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
              From Our Kitchen
            </p>
            <h3 className="font-serif text-3xl font-bold text-hotel-900 dark:text-white">
              Signature Dishes
            </h3>
          </div>

          <div
            className="relative rounded-2xl overflow-hidden shadow-xl group/carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slides */}
            <div className="relative h-[350px] sm:h-[450px] lg:h-[520px]">
              {FOOD_GALLERY.map((item, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    i === current
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="max-w-xl">
                      <span className="inline-block rounded-full bg-gold-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white mb-3 backdrop-blur-sm">
                        {i + 1} / {total}
                      </span>
                      <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        {item.title}
                      </h4>
                      <p className="text-sm sm:text-base text-white/80 drop-shadow">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next buttons */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-white/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-white/40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:bottom-6">
              {FOOD_GALLERY.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 h-2 bg-gold-400'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{ width: `${((current + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Culinary Excellence
          </p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 dark:text-white mb-4">
            Dining & Cuisine
          </h2>
          <p className="mx-auto max-w-2xl text-hotel-500 dark:text-hotel-400 leading-relaxed">
            Embark on a culinary journey with our award-winning restaurants, each offering
            a unique gastronomic experience crafted by world-class chefs.
          </p>
        </div>

        {/* Restaurant cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {RESTAURANTS.map((r) => (
            <div
              key={r.name}
              className="group flex flex-col rounded-2xl bg-white dark:bg-dark-bg border border-hotel-100 dark:border-dark-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl font-bold text-white mb-1 drop-shadow">{r.name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1.5">
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    {r.cuisine}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 rounded-full px-3 py-1.5 w-fit mb-4">
                  <Clock className="h-3.5 w-3.5" />
                  {r.hours}
                </div>
                <p className="text-sm text-hotel-500 dark:text-hotel-400 leading-relaxed mb-5">{r.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-hotel-50 dark:bg-dark-card px-3 py-1 text-xs font-medium text-hotel-600 dark:text-hotel-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onReserveTable?.(r.name)}
                  className="mt-auto flex items-center justify-center gap-2 w-full rounded-xl bg-hotel-900 dark:bg-gold-600 py-3 text-sm font-semibold text-white transition-all hover:bg-hotel-800 dark:hover:bg-gold-700 active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4" />
                  Reserve a Table
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights banner */}
        <div className="rounded-2xl bg-gradient-to-br from-hotel-900 to-hotel-800 p-10 lg:p-14">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            {/* Text */}
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">
                Why Dine With Us
              </p>
              <h3 className="font-serif text-3xl font-bold text-white mb-4 leading-tight">
                A Feast for<br />Every Palate
              </h3>
              <p className="text-hotel-300 leading-relaxed text-sm">
                From sunrise breakfast buffets to moonlit fine dining, our culinary team
                transforms every meal into an unforgettable experience. All-day room service
                is also available for guests who prefer to dine in privacy.
              </p>
            </div>

            {/* Highlight cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {DINING_HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="flex items-start gap-4 rounded-xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-600/20 text-gold-400">
                    <h.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{h.title}</h4>
                    <p className="text-xs text-hotel-300 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
