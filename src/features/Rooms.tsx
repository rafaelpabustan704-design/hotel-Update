'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Check, BedDouble, Users, Ruler, Eye } from 'lucide-react';
import { FEATURE_ICONS, FEATURE_LABELS } from '@/utils/room-features';
import { useRooms } from '@/hooks/RoomContext';
import { useRoomTypes } from '@/hooks/RoomTypeContext';
import { useLandingContent } from '@/hooks/LandingContentContext';

interface RoomDetail {
  id: number | string;
  name: string;
  roomTypeKey: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  features: string[];
  specs: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
  inclusions: string[];
}

interface RoomModalProps {
  room: RoomDetail;
  onClose: () => void;
  onBookNow: (roomType?: string) => void;
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl max-h-[95vh] rounded-2xl bg-white dark:bg-dark-card shadow-2xl animate-modal-content overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 text-hotel-600 dark:text-hotel-300 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-dark-card hover:text-hotel-900 dark:hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-2 max-h-[95vh]">
          <div className="relative bg-hotel-900 flex flex-col">
            <div className="relative h-[280px] sm:h-[350px] lg:flex-1 lg:min-h-0">
              {room.images.map((src, i) => (
                <img key={i} src={src} alt={`${room.name} - Photo ${i + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`} />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
              <button onClick={() => goTo(currentImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => goTo(currentImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronRight className="h-5 w-5" /></button>
              <span className="absolute top-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{currentImg + 1} / {total}</span>
            </div>
            <div className="flex gap-1 p-1 bg-hotel-900 shrink-0">
              {room.images.map((src, i) => (
                <button key={i} onClick={() => goTo(i)} className={`relative flex-1 h-12 sm:h-14 overflow-hidden rounded-md transition-all ${i === currentImg ? 'ring-2 ring-gold-400 opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-6 lg:overflow-y-auto lg:max-h-[95vh] flex flex-col">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-0.5">{room.tagline}</p>
              <h2 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white">{room.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gold-600">&#8369;{room.price.toLocaleString()}</span>
                <span className="text-sm text-hotel-400">/night</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {room.specs.map((spec) => (
                <div key={spec.label} className="rounded-lg bg-hotel-50 dark:bg-dark-bg p-2 text-center">
                  <spec.icon className="h-4 w-4 mx-auto text-gold-600 mb-0.5" />
                  <p className="text-[9px] uppercase tracking-wider text-hotel-400 font-medium">{spec.label}</p>
                  <p className="text-xs font-bold text-hotel-900 dark:text-white leading-tight">{spec.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-1">About This Room</h4>
              <p className="text-xs text-hotel-500 dark:text-hotel-400 leading-relaxed line-clamp-3">{room.longDescription}</p>
            </div>
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-1.5">Room Features</h4>
              <div className="flex flex-wrap gap-1.5">
                {room.features.map((feature) => {
                  const Icon = FEATURE_ICONS[feature];
                  return (
                    <div key={feature} className="flex items-center gap-1 rounded-full bg-hotel-50 dark:bg-dark-bg px-2.5 py-1 text-hotel-600 dark:text-hotel-300">
                      <Icon className="h-3 w-3" /><span className="text-[11px] font-medium">{FEATURE_LABELS[feature]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-1.5">What&apos;s Included</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {room.inclusions.map((item) => (
                  <div key={item} className="flex items-start gap-1.5"><Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-500" /><span className="text-xs text-hotel-600 dark:text-hotel-300 leading-tight">{item}</span></div>
                ))}
              </div>
            </div>
            <button onClick={() => { onClose(); onBookNow(room.roomTypeKey); }} className="mt-auto w-full rounded-xl bg-gold-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">
              Book This Room — &#8369;{room.price.toLocaleString()}/night
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RoomsProps {
  onBookNow: (roomType?: string) => void;
}

export default function Rooms({ onBookNow }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const { rooms: managedRooms } = useRooms();
  const { roomTypes } = useRoomTypes();
  const { sectionHeaders } = useLandingContent();
  const roomsH = sectionHeaders.rooms;

  const mergedRooms = useMemo(() => {
    const AMENITY_TO_FEATURE: Record<string, string> = {
      wifi: 'wifi', coffee: 'coffee', tv: 'tv', bath: 'bath',
      'mini bar': 'minibar', 'room service': 'roomservice',
      'air conditioning': 'airconditioning', safe: 'safe',
      'lounge access': 'loungeaccess', 'butler service': 'butlerservice',
      'private terrace': 'privateterrace', balcony: 'balcony',
      kitchen: 'kitchen', jacuzzi: 'jacuzzi',
    };
    const AMENITY_KEYS = new Set(Object.keys(AMENITY_TO_FEATURE));

    return managedRooms.map((mr) => {
      const rt = roomTypes.find((t) => t.id === mr.roomTypeId);
      const rtName = rt?.name || '';
      const perks = rt?.perks || [];

      const features = perks
        .filter((p) => AMENITY_KEYS.has(p.toLowerCase()))
        .map((p) => AMENITY_TO_FEATURE[p.toLowerCase()])
        .filter((f): f is string => !!f);

      const inclusions = perks.filter((p) => !AMENITY_KEYS.has(p.toLowerCase()));

      const specs = [
        { icon: BedDouble, label: 'Bed', value: mr.bedType ? `${mr.bedQty || 1} ${mr.bedType}${mr.extraBedType ? ` + ${mr.extraBedQty || 1} ${mr.extraBedType}` : ''}` : 'King Size' },
        { icon: Ruler, label: 'Size', value: mr.roomSize || '' },
        { icon: Eye, label: 'View', value: mr.view || '' },
        { icon: Users, label: 'Capacity', value: `${mr.maxPax} Guests` },
      ].filter((s) => s.value);

      const perkList = perks.length > 0 ? perks.join(', ') : 'essential amenities';

      return {
        id: mr.id,
        name: mr.name,
        roomTypeKey: rtName,
        tagline: mr.tagline || rtName || 'Hotel Accommodation',
        description: mr.description || `A comfortable ${mr.name.toLowerCase()} for up to ${mr.maxPax} guests.`,
        longDescription: mr.longDescription || mr.description || `Enjoy your stay in our ${mr.name.toLowerCase()}. This room accommodates up to ${mr.maxPax} guests and includes ${perkList}.`,
        price: mr.price,
        images: mr.images.length > 0 ? mr.images : ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80'],
        features,
        specs,
        inclusions: inclusions.length > 0 ? inclusions : ['Daily housekeeping', 'High-speed WiFi'],
      } as RoomDetail;
    });
  }, [managedRooms, roomTypes]);

  return (
    <section id="rooms" className="scroll-mt-20 py-24 bg-hotel-50 dark:bg-dark-bg transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">{roomsH.label}</p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 dark:text-white mb-4">{roomsH.title}</h2>
          <p className="mx-auto max-w-2xl text-hotel-500 dark:text-hotel-400 leading-relaxed">
            {roomsH.description}
          </p>
        </div>

        <div className={`grid gap-8 ${mergedRooms.length === 1 ? 'max-w-md mx-auto' : mergedRooms.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : mergedRooms.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {mergedRooms.map((room) => (
            <div key={room.id} className="group flex flex-col rounded-2xl bg-white dark:bg-dark-card shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer" onClick={() => setSelectedRoom(room)}>
              <div className="relative h-56 overflow-hidden">
                <img src={room.images[0]} alt={room.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 rounded-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-hotel-900 dark:text-white shadow-md">
                  &#8369;{room.price.toLocaleString()}<span className="text-hotel-400 font-normal">/night</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-hotel-900 shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">View Details</span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-1 truncate">{room.name}</h3>
                <p className="text-xs text-gold-600 font-medium mb-3 truncate">{room.tagline}</p>
                <p className="text-sm text-hotel-500 dark:text-hotel-400 leading-relaxed mb-5 line-clamp-2">{room.description}</p>
                <div className="mt-auto">
                  <div className="flex flex-wrap items-center gap-2 mb-6 h-[4.25rem] overflow-hidden">
                    {room.features.slice(0, 6).map((feature) => {
                      const Icon = FEATURE_ICONS[feature];
                      if (!Icon) return null;
                      return (
                        <div key={feature} className="flex items-center gap-1.5 rounded-full bg-hotel-50 dark:bg-dark-bg px-3 py-1.5 text-hotel-600 dark:text-hotel-300">
                          <Icon className="h-3.5 w-3.5" /><span className="text-xs font-medium">{FEATURE_LABELS[feature]}</span>
                        </div>
                      );
                    })}
                    {room.features.length > 6 && (
                      <span className="text-xs text-hotel-400 font-medium">+{room.features.length - 6} more</span>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onBookNow(room.roomTypeKey); }} className="w-full rounded-xl bg-hotel-900 dark:bg-gold-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gold-600 dark:hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">Book This Room</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onBookNow={onBookNow} />}
    </section>
  );
}
