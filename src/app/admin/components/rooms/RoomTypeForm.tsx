'use client';

import { XCircle } from 'lucide-react';
import { COLOR_OPTIONS } from '@/hooks/RoomTypeContext';
import { inputCls, labelCls } from '../shared';
import { SectionHeading, SectionCard } from '../SectionHelpers';
import ChipSelector, { PERK_OPTIONS_AMENITIES, PERK_OPTIONS_INCLUSIONS } from './ChipSelector';

interface RoomTypeFormProps {
    name: string;
    color: string;
    perks: string[];
    error: string;
    submitLabel: string;
    onNameChange: (name: string) => void;
    onColorChange: (color: string) => void;
    onPerksChange: (perks: string[]) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
}

export default function RoomTypeForm({ name, color, perks, error, submitLabel, onNameChange, onColorChange, onPerksChange, onSubmit, onCancel }: RoomTypeFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
                <div>
                    <label className={labelCls}>Name</label>
                    <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Deluxe Room" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Color</label>
                    <div className="flex gap-2">
                        {COLOR_OPTIONS.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => onColorChange(c.value)}
                                className={`h-9 w-9 rounded-full border-2 transition-all ${color === c.value ? 'border-white ring-2 ring-offset-1 ring-offset-white dark:ring-offset-dark-card scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                style={{ backgroundColor: c.hex, ...(color === c.value ? { '--tw-ring-color': c.hex } as React.CSSProperties : {}) }}
                                title={c.label}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <SectionCard>
                <SectionHeading>Amenities</SectionHeading>
                <ChipSelector options={PERK_OPTIONS_AMENITIES} columns={3} selected={perks} onChange={onPerksChange} />
            </SectionCard>

            <SectionCard>
                <SectionHeading>What&apos;s Included</SectionHeading>
                <ChipSelector options={PERK_OPTIONS_INCLUSIONS} selected={perks} onChange={onPerksChange} />
            </SectionCard>

            {perks.length > 0 && (
                <p className="text-[11px] text-hotel-400">{perks.length} perk{perks.length !== 1 ? 's' : ''} selected</p>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
            <div className="flex gap-3">
                <button type="submit" className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">{submitLabel}</button>
                {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-hotel-200 dark:border-dark-border px-6 py-3 text-sm font-medium text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">Cancel</button>}
            </div>
        </form>
    );
}
