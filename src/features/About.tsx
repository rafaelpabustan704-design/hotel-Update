'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ABOUT_STATS, ABOUT_IMAGES } from '@/constants/hotel';

export default function About() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = ABOUT_IMAGES.length;

  const goTo = useCallback(
    (index: number) => setCurrent(((index % total) + total) % total),
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section id="about" className="scroll-mt-20 py-12 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image carousel side */}
          <div className="relative pb-0 pr-0 sm:pb-6 sm:pr-6 lg:pb-6 lg:pr-6">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl group/about"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Slides */}
              <div className="relative h-[280px] sm:h-[400px] lg:h-[500px]">
                {ABOUT_IMAGES.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
                      i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <button
                onClick={() => goTo(current - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/30 sm:bg-white/20 text-white backdrop-blur-md transition-all sm:opacity-0 sm:group-hover/about:opacity-100 hover:bg-white/40"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/30 sm:bg-white/20 text-white backdrop-blur-md transition-all sm:opacity-0 sm:group-hover/about:opacity-100 hover:bg-white/40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {ABOUT_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-7 h-2 bg-gold-400'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="absolute bottom-0 right-0 rounded-2xl bg-gold-600 p-8 text-white shadow-xl hidden lg:block">
              <p className="text-4xl font-serif font-bold">25+</p>
              <p className="text-sm mt-1 text-gold-100">Years of Excellence</p>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
              Welcome to Grand Horizon
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-hotel-900 mb-4 sm:mb-6 leading-tight">
              A Legacy of Luxury &<br />Unmatched Hospitality
            </h2>
            <p className="text-sm sm:text-base text-hotel-600 leading-relaxed mb-4 sm:mb-6">
              Since 1999, Grand Horizon Hotel has been the epitome of refined luxury. Every detail,
              from our meticulously designed rooms to our world-class dining, is crafted to provide
              an unforgettable experience.
            </p>
            <p className="text-sm sm:text-base text-hotel-600 leading-relaxed mb-6 sm:mb-10">
              Our dedicated staff ensures that every moment of your stay surpasses expectations.
              Whether you&apos;re here for business or leisure, discover a sanctuary where elegance
              meets comfort.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {ABOUT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 sm:gap-4 rounded-xl bg-hotel-50 p-3 sm:p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold text-hotel-900 truncate">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-hotel-500 leading-tight">{stat.label}</p>
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
