'use client';

import { useState, useEffect, useCallback } from 'react';
import { UtensilsCrossed, Clock, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveIcon } from '@/utils/icons';

interface DiningProps {
  onReserveTable?: (restaurant: string) => void;
}

export default function Dining({ onReserveTable }: DiningProps) {
  const { restaurants, signatureDishes, diningHighlights, sectionHeaders } = useLandingContent();
  const dH = sectionHeaders.dining;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = signatureDishes.length || 1;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % total) + total) % total);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused, total]);

  return (
    <section id="dining" className="scroll-mt-20 py-24 bg-white dark:bg-dark-card transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Food photo carousel */}
        {signatureDishes.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
                {dH.sliderLabel}
              </p>
              <h3 className="font-serif text-3xl font-bold text-hotel-900 dark:text-white">
                {dH.sliderTitle}
              </h3>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden shadow-xl group/carousel"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative h-[350px] sm:h-[450px] lg:h-[520px]">
                {signatureDishes.map((item, i) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                  >
                    {item.image && <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                      <div className="max-w-xl">
                        <span className="inline-block rounded-full bg-gold-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white mb-3 backdrop-blur-sm">
                          {i + 1} / {total}
                        </span>
                        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">{item.title}</h4>
                        <p className="text-sm sm:text-base text-white/80 drop-shadow">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-white/40">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:bg-white/40">
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:bottom-6">
                {signatureDishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${((current + 1) / total) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">{dH.label}</p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 dark:text-white mb-4">{dH.title}</h2>
          <p className="mx-auto max-w-2xl text-hotel-500 dark:text-hotel-400 leading-relaxed">
            {dH.description}
          </p>
        </div>

        {/* Restaurant cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {restaurants.map((r) => (
            <div key={r.id} className="group flex flex-col rounded-2xl bg-white dark:bg-dark-bg border border-hotel-100 dark:border-dark-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                {r.image && <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl font-bold text-white mb-1 drop-shadow">{r.name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1.5"><UtensilsCrossed className="h-3.5 w-3.5" />{r.cuisine}</p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 rounded-full px-3 py-1.5 w-fit mb-4">
                  <Clock className="h-3.5 w-3.5" />{r.hours}
                </div>
                <p className="text-sm text-hotel-500 dark:text-hotel-400 leading-relaxed mb-5">{r.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {r.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-hotel-50 dark:bg-dark-card px-3 py-1 text-xs font-medium text-hotel-600 dark:text-hotel-300">{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => onReserveTable?.(r.name)}
                  className="mt-auto flex items-center justify-center gap-2 w-full rounded-xl bg-hotel-900 dark:bg-gold-600 py-3 text-sm font-semibold text-white transition-all hover:bg-hotel-800 dark:hover:bg-gold-700 active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4" />{r.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights banner */}
        {diningHighlights.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-hotel-900 to-hotel-800 p-10 lg:p-14">
            <div className="grid lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">{dH.highlightLabel}</p>
                <h3 className="font-serif text-3xl font-bold text-white mb-4 leading-tight">{dH.highlightTitle}</h3>
                <p className="text-hotel-300 leading-relaxed text-sm">
                  {dH.highlightDescription}
                </p>
              </div>
              <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
                {diningHighlights.map((h) => {
                  const HIcon = resolveIcon(h.icon);
                  return (
                    <div key={h.id} className="flex items-start gap-4 rounded-xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-600/20 text-gold-400">
                        <HIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">{h.title}</h4>
                        <p className="text-xs text-hotel-300 leading-relaxed">{h.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
