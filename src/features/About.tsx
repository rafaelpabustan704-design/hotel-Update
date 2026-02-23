'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveIcon } from '@/utils/icons';
import { useTemplateResolver } from '@/providers/hooks/useTemplateResolver';

export default function About() {
  const { aboutContent } = useLandingContent();
  const t = useTemplateResolver();
  const images = aboutContent.images.filter((img) => img.src);
  const stats = aboutContent.stats;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = images.length || 1;

  const goTo = useCallback(
    (index: number) => setCurrent(((index % total) + total) % total),
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, total]);

  const firstStat = stats[0];

  return (
    <section id="about" className="scroll-mt-20 py-12 sm:py-24 bg-white dark:bg-dark-card transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="relative pb-0 pr-0 sm:pb-6 sm:pr-6 lg:pb-6 lg:pr-6">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl group/about"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative h-[280px] sm:h-[400px] lg:h-[500px]">
                {images.map((img, i) => (
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

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {images.map((_, i) => (
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

            {firstStat && (
              <div className="absolute bottom-0 right-0 rounded-2xl bg-gold-600 p-8 text-white shadow-xl hidden lg:block">
                <p className="text-4xl font-serif font-bold">{firstStat.value}</p>
                <p className="text-sm mt-1 text-gold-100">{firstStat.label}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
              {t(aboutContent.sectionLabel)}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-hotel-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              {t(aboutContent.title)}
            </h2>
            {aboutContent.description.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-sm sm:text-base text-hotel-600 dark:text-hotel-400 leading-relaxed mb-4 sm:mb-6">
                {t(paragraph)}
              </p>
            ))}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => {
                const StatIcon = resolveIcon(stat.icon);
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 sm:gap-4 rounded-xl bg-hotel-50 dark:bg-dark-bg p-3 sm:p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                      <StatIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold text-hotel-900 dark:text-white truncate">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-hotel-500 dark:text-hotel-400 leading-tight">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
