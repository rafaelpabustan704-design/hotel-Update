'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import type { RoomType } from '@/types';
import { inputCls, labelCls } from '../shared';
import { MultiImageUploader } from '../ImageUploader';
import { SectionHeading, SectionCard, formatPhp } from '../SectionHelpers';

export const EMPTY_FORM = { name: '', roomTypeId: '', price: 0, maxPax: 2, description: '', longDescription: '', tagline: '', bedType: '', bedQty: 1, extraBedType: '', extraBedQty: 0, roomSize: '', view: '', amenities: '', inclusions: '' };

export const AMENITY_KEYS = new Set([
    'wifi', 'coffee', 'tv', 'bath', 'mini bar', 'room service',
    'air conditioning', 'safe', 'lounge access', 'butler service',
    'private terrace', 'balcony', 'kitchen', 'jacuzzi',
]);

export interface RoomFormProps {
    form: typeof EMPTY_FORM;
    images: string[];
    roomTypes: RoomType[];
    error: string;
    submitLabel: string;
    onFormChange: (updates: Partial<typeof EMPTY_FORM>) => void;
    onImagesChange: (imgs: string[]) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
}

export default function RoomForm({ form, images, roomTypes, error, submitLabel, onFormChange, onImagesChange, onSubmit, onCancel }: RoomFormProps) {
    const [priceInput, setPriceInput] = useState(form.price > 0 ? form.price.toString() : '');
    const [priceFocused, setPriceFocused] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <SectionCard>
                <SectionHeading>Basic Information</SectionHeading>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Name</label>
                        <input type="text" value={form.name} onChange={(e) => onFormChange({ name: e.target.value })} placeholder="e.g. Ocean View Deluxe" required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Room Type</label>
                        <select value={form.roomTypeId} onChange={(e) => {
                            const rt = roomTypes.find((t) => t.id === e.target.value);
                            onFormChange({ roomTypeId: e.target.value, ...(rt ? { maxPax: rt.maxAdults + rt.maxChildren } : {}) });
                        }} required className={inputCls}>
                            <option value="">Select room type</option>
                            {roomTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelCls}>Price (per night)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-hotel-500 dark:text-hotel-400 font-semibold pointer-events-none">₱</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={priceFocused ? priceInput : (form.price > 0 ? form.price.toLocaleString('en-PH') : '')}
                                onFocus={() => { setPriceFocused(true); setPriceInput(form.price > 0 ? form.price.toString() : ''); }}
                                onBlur={() => { setPriceFocused(false); }}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                                    setPriceInput(raw);
                                    onFormChange({ price: parseFloat(raw) || 0 });
                                }}
                                placeholder="0"
                                className={`${inputCls} pl-9`}
                            />
                        </div>
                        {form.price > 0 && !priceFocused && (
                            <p className="text-[11px] text-hotel-400 mt-1">{formatPhp(form.price)} per night</p>
                        )}
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <SectionHeading>Descriptions</SectionHeading>
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Short Description</label>
                        <textarea value={form.description} onChange={(e) => onFormChange({ description: e.target.value })} rows={2} placeholder="Brief summary shown on the room card" className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                        <label className={labelCls}>Full Description</label>
                        <textarea value={form.longDescription} onChange={(e) => onFormChange({ longDescription: e.target.value })} rows={4} placeholder="Detailed description shown in the room detail view" className={`${inputCls} resize-none`} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <SectionHeading>Images</SectionHeading>
                <MultiImageUploader preset="gallery" images={images} onChange={onImagesChange} />
            </SectionCard>

            {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
            <div className="flex gap-3 pt-2 border-t border-hotel-100 dark:border-dark-border">
                <button type="submit" className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">{submitLabel}</button>
                {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-hotel-200 dark:border-dark-border px-6 py-3 text-sm font-medium text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">Cancel</button>}
            </div>
        </form>
    );
}
