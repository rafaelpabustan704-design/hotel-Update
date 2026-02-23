'use client';

import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveIcon } from '@/utils/icons';

export default function Amenities() {
  const { amenities, sectionHeaders } = useLandingContent();
  const aH = sectionHeaders.amenities;

  return (
    <section id="amenities" className="scroll-mt-20 relative py-24 overflow-hidden">
      {aH.backgroundImage && (
        <img
          src={aH.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">
            {aH.label}
          </p>
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            {aH.title}
          </h2>
          <p className="mx-auto max-w-2xl text-hotel-300 leading-relaxed">
            {aH.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item) => {
            const ItemIcon = resolveIcon(item.icon);
            return (
              <div
                key={item.id}
                className="group flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-8 text-center transition-all duration-300 hover:bg-white/20 hover:border-white/20 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-600/20 text-gold-400 transition-all duration-300 group-hover:bg-gold-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold-600/25">
                  <ItemIcon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="mt-auto text-sm text-hotel-300 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
