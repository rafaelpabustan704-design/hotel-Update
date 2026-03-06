'use client';

import { useState } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Eye, BedDouble, Users, Ruler } from 'lucide-react';
import type { RoomType, ManagedRoom } from '@/types';
import { FEATURE_ICONS, FEATURE_LABELS } from '@/utils/room-features';
import { AMENITY_KEYS } from './RoomForm';

/* ── Preview Data ── */

interface PreviewData {
    name: string;
    tagline: string;
    price: number;
    images: string[];
    specs: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
    longDescription: string;
    features: string[];
    inclusions: string[];
}

const AMENITY_TO_FEATURE: Record<string, string> = {
    wifi: 'wifi', coffee: 'coffee', tv: 'tv', bath: 'bath',
    'mini bar': 'minibar', 'room service': 'roomservice',
    'air conditioning': 'airconditioning', safe: 'safe',
    'lounge access': 'loungeaccess', 'butler service': 'butlerservice',
    'private terrace': 'privateterrace', balcony: 'balcony',
    kitchen: 'kitchen', jacuzzi: 'jacuzzi',
};

function buildPreview(room: ManagedRoom, roomTypes: RoomType[]): PreviewData {
    const rt = roomTypes.find((t) => t.id === room.roomTypeId);
    const rtName = rt?.name || '';
    const perks = rt?.perks || [];

    const features = perks
        .filter((p) => AMENITY_KEYS.has(p.toLowerCase()))
        .map((p) => AMENITY_TO_FEATURE[p.toLowerCase()])
        .filter((f): f is string => !!f);

    const inclusions = perks.filter((p) => !AMENITY_KEYS.has(p.toLowerCase()));

    return {
        name: room.name,
        tagline: room.tagline || rtName || 'Hotel Accommodation',
        price: room.price,
        images: (() => {
            const imgs = (room.images || []).filter(Boolean);
            return imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80'];
        })(),
        specs: [
            { icon: BedDouble, label: 'Bed', value: room.bedType ? `${room.bedQty || 1} ${room.bedType}${room.extraBedType ? ` + ${room.extraBedQty || 1} ${room.extraBedType}` : ''}` : '' },
            { icon: Ruler, label: 'Size', value: room.roomSize || '' },
            { icon: Eye, label: 'View', value: room.view || '' },
            { icon: Users, label: 'Capacity', value: `${room.maxPax} Guests` },
        ].filter((sp) => sp.value),
        longDescription: room.longDescription || room.description || '',
        features,
        inclusions: inclusions.length > 0 ? inclusions : ['Daily housekeeping', 'High-speed WiFi'],
    };
}

/* ── Preview Modal ── */

export default function RoomPreviewModal({ room, roomTypes, onClose }: { room: ManagedRoom; roomTypes: RoomType[]; onClose: () => void }) {
    const preview = buildPreview(room, roomTypes);
    const [currentImg, setCurrentImg] = useState(0);
    const total = preview.images.length;
    const goTo = (i: number) => setCurrentImg(((i % total) + total) % total);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white dark:bg-dark-card shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 text-hotel-600 dark:text-hotel-300 shadow-md backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-dark-card hover:text-hotel-900 dark:hover:text-white">
                    <X className="h-5 w-5" />
                </button>

                <div className="absolute top-3 left-3 z-20 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Preview</div>

                <div className="grid lg:grid-cols-2 max-h-[90vh]">
                    {/* Image gallery */}
                    <div className="relative bg-hotel-900 flex flex-col">
                        <div className="relative h-[250px] sm:h-[300px] lg:flex-1 lg:min-h-0">
                            {preview.images.map((src, i) => (
                                <img key={i} src={src} alt={`${preview.name} - Photo ${i + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`} />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            {total > 1 && (
                                <>
                                    <button onClick={() => goTo(currentImg - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronLeft className="h-5 w-5" /></button>
                                    <button onClick={() => goTo(currentImg + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"><ChevronRight className="h-5 w-5" /></button>
                                </>
                            )}
                            <span className="absolute top-3 right-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{currentImg + 1} / {total}</span>
                        </div>
                        {total > 1 && (
                            <div className="flex gap-1 p-1.5 bg-hotel-900 shrink-0">
                                {preview.images.map((src, i) => (
                                    <button key={i} onClick={() => goTo(i)} className={`relative flex-1 h-14 sm:h-16 overflow-hidden rounded-md transition-all ${i === currentImg ? 'ring-2 ring-gold-400 opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-5 sm:p-6 lg:p-7 lg:overflow-y-auto lg:max-h-[90vh]">
                        <div className="mb-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-0.5">{preview.tagline}</p>
                            <h2 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white mb-1">{preview.name}</h2>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gold-600">&#8369;{preview.price.toLocaleString()}</span>
                                <span className="text-sm text-hotel-400">/night</span>
                            </div>
                        </div>

                        {preview.specs.length > 0 && (
                            <div className={`grid gap-2 mb-4 ${preview.specs.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                {preview.specs.map((spec) => (
                                    <div key={spec.label} className="rounded-lg bg-hotel-50 dark:bg-dark-bg p-2 text-center">
                                        <spec.icon className="h-4 w-4 mx-auto text-gold-600 mb-0.5" />
                                        <p className="text-[9px] uppercase tracking-wider text-hotel-400 font-medium">{spec.label}</p>
                                        <p className="text-xs font-bold text-hotel-900 dark:text-white leading-tight">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {preview.longDescription && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-1">About This Room</h4>
                                <p className="text-xs text-hotel-500 dark:text-hotel-400 leading-relaxed">{preview.longDescription}</p>
                            </div>
                        )}

                        {preview.features.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-2">Room Features</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {preview.features.map((feature) => {
                                        const Icon = FEATURE_ICONS[feature];
                                        if (!Icon) return null;
                                        return (
                                            <div key={feature} className="flex items-center gap-1 rounded-full bg-hotel-50 dark:bg-dark-bg px-2.5 py-1 text-hotel-600 dark:text-hotel-300">
                                                <Icon className="h-3 w-3" /><span className="text-[11px] font-medium">{FEATURE_LABELS[feature]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {preview.inclusions.length > 0 && (
                            <div className="mb-5">
                                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white mb-2">What&apos;s Included</h4>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                    {preview.inclusions.map((item) => (
                                        <div key={item} className="flex items-start gap-1.5"><Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-500" /><span className="text-xs text-hotel-600 dark:text-hotel-300">{item}</span></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl bg-gold-600 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 opacity-75 cursor-default">
                            Book This Room — &#8369;{preview.price.toLocaleString()}/night
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
