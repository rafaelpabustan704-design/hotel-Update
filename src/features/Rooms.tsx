'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ROOMS, FEATURE_ICONS, FEATURE_LABELS } from '@/constants/hotel';
import type { RoomDetail } from '@/utils/types';

/* ------------------------------------------------------------------ */
/*  Room Detail Modal                                                  */
/* ------------------------------------------------------------------ */

interface RoomModalProps {
  room: RoomDetail;
  onClose: () => void;
  onBookNow: () => void;
}

function RoomModal({ room, onClose, onBookNow }: RoomModalProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const total = room.images.length;

  const goTo = useCallback(
    (i: number) => setCurrentImg(((i % total) + total) % total),
    [total],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(currentImg - 1);
      if (e.key === 'ArrowRight') goTo(currentImg + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, currentImg, goTo]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-2xl animate-modal-content overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-hotel-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-hotel-900 sticky"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-2 lg:h-full lg:max-h-[90vh]">
          {/* ---- Left: Photo gallery ---- */}
          <div className="relative bg-hotel-900 flex flex-col">
            {/* Main image */}
            <div className="relative h-[250px] sm:h-[300px] lg:flex-1 lg:min-h-0">
              {room.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${room.name} - Photo ${i + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    i === currentImg ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />

              {/* Nav arrows */}
              <button
                onClick={() => goTo(currentImg - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(currentImg + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Counter */}
              <span className="absolute top-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {currentImg + 1} / {total}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-1 p-1.5 bg-hotel-900 shrink-0">
              {room.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative flex-1 h-14 sm:h-16 overflow-hidden rounded-md transition-all ${
                    i === currentImg
                      ? 'ring-2 ring-gold-400 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ---- Right: Details ---- */}
          <div className="p-5 sm:p-6 lg:p-7 lg:overflow-y-auto lg:max-h-[90vh]">
            {/* Header */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-0.5">
                {room.tagline}
              </p>
              <h2 className="font-serif text-2xl font-bold text-hotel-900 mb-1">
                {room.name}
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gold-600">₱{room.price.toLocaleString()}</span>
                <span className="text-sm text-hotel-400">/night</span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {room.specs.map((spec) => (
                <div key={spec.label} className="rounded-lg bg-hotel-50 p-2 text-center">
                  <spec.icon className="h-4 w-4 mx-auto text-gold-600 mb-0.5" />
                  <p className="text-[9px] uppercase tracking-wider text-hotel-400 font-medium">{spec.label}</p>
                  <p className="text-xs font-bold text-hotel-900 leading-tight">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-hotel-900 mb-1">About This Room</h4>
              <p className="text-xs text-hotel-500 leading-relaxed">
                {room.longDescription}
              </p>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-hotel-900 mb-2">Room Features</h4>
              <div className="flex flex-wrap gap-1.5">
                {room.features.map((feature) => {
                  const Icon = FEATURE_ICONS[feature];
                  return (
                    <div
                      key={feature}
                      className="flex items-center gap-1 rounded-full bg-hotel-50 px-2.5 py-1 text-hotel-600"
                    >
                      <Icon className="h-3 w-3" />
                      <span className="text-[11px] font-medium">{FEATURE_LABELS[feature]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What's included */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-hotel-900 mb-2">What&apos;s Included</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {room.inclusions.map((item) => (
                  <div key={item} className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-500" />
                    <span className="text-xs text-hotel-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                onClose();
                onBookNow();
              }}
              className="w-full rounded-xl bg-gold-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98]"
            >
              Book This Room — ₱{room.price.toLocaleString()}/night
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rooms Section                                                      */
/* ------------------------------------------------------------------ */

interface RoomsProps {
  onBookNow: () => void;
}

export default function Rooms({ onBookNow }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  return (
    <section id="rooms" className="scroll-mt-20 py-24 bg-hotel-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Accommodations
          </p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 mb-4">
            Our Signature Rooms
          </h2>
          <p className="mx-auto max-w-2xl text-hotel-500 leading-relaxed">
            Each room is a sanctuary of comfort, thoughtfully designed with premium materials and
            modern amenities to ensure a memorable stay.
          </p>
        </div>

        {/* Room cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROOMS.map((room) => (
            <div
              key={room.id}
              className="group flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedRoom(room)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-hotel-900 shadow-md">
                  ₱{room.price.toLocaleString()}<span className="text-hotel-400 font-normal">/night</span>
                </div>
                {/* View details hint */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-hotel-900 shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    View Details
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-serif text-xl font-bold text-hotel-900 mb-1">{room.name}</h3>
                <p className="text-xs text-gold-600 font-medium mb-3">{room.tagline}</p>
                <p className="text-sm text-hotel-500 leading-relaxed mb-5">{room.description}</p>

                {/* Features */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {room.features.map((feature) => {
                    const Icon = FEATURE_ICONS[feature];
                    return (
                      <div
                        key={feature}
                        className="flex items-center gap-1.5 rounded-full bg-hotel-50 px-3 py-1.5 text-hotel-600"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{FEATURE_LABELS[feature]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookNow();
                    }}
                    className="w-full rounded-xl bg-hotel-900 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gold-600 active:scale-[0.98]"
                  >
                    Book This Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room detail modal */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookNow={onBookNow}
        />
      )}
    </section>
  );
}
