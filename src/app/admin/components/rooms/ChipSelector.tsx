'use client';

import { Check } from 'lucide-react';

interface ChipSelectorProps {
    options: string[];
    selected: string[];
    onChange: (items: string[]) => void;
    columns?: number;
}

/**
 * Multi-select chip/tag component for perk/amenity selection.
 * Renders a grid of toggleable chips with checkboxes.
 */
export default function ChipSelector({ options, selected, onChange, columns = 2 }: ChipSelectorProps) {
    const toggle = (item: string) => {
        onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
    };

    const gridCls = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

    return (
        <div className={`grid ${gridCls} gap-1.5`}>
            {options.map((opt) => {
                const active = selected.includes(opt);
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border text-left transition-all ${active
                                ? 'border-gold-500 bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300 dark:border-gold-600'
                                : 'border-hotel-200 dark:border-dark-border text-hotel-500 dark:text-hotel-400 hover:border-hotel-300 dark:hover:border-hotel-600'
                            }`}
                    >
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${active ? 'bg-gold-600 border-gold-600 dark:bg-gold-500 dark:border-gold-500' : 'border-hotel-300 dark:border-hotel-600'}`}>
                            {active && <Check className="h-2.5 w-2.5 text-white" />}
                        </span>
                        <span className="truncate">{opt}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* Perk option lists */
export const PERK_OPTIONS_AMENITIES = [
    'WiFi', 'Coffee', 'TV', 'Bath', 'Mini Bar', 'Room Service',
    'Air Conditioning', 'Safe', 'Lounge Access', 'Butler Service',
    'Private Terrace', 'Balcony', 'Kitchen', 'Jacuzzi',
];

export const PERK_OPTIONS_INCLUSIONS = [
    'Daily breakfast buffet', 'Welcome drink on arrival', 'High-speed WiFi',
    'Daily housekeeping', 'Access to fitness center', 'In-room safe & minibar',
    'Executive Lounge access', 'Evening cocktails & canapés', 'Turndown service',
    'Complimentary pressing service', 'Late checkout (subject to availability)',
    'Soaking tub & rain shower', 'Nespresso machine & premium minibar',
    '24-hour dedicated butler service', 'Daily breakfast in-suite or restaurant',
    'Airport limousine transfer', 'Private terrace with jacuzzi',
    'Premium bar & Champagne selection', 'Complimentary spa treatment (60 min)',
    'Bose surround sound system', 'Walk-in wardrobe & pressing service',
    'Priority restaurant reservations', 'Late checkout guaranteed',
];
