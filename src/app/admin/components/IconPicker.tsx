'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { resolveIcon, getIconsForCategory, getSuggestedIcons, type IconCategory } from '@/utils/icons';

interface Props {
  value: string;
  onChange: (icon: string) => void;
  category: IconCategory;
  className?: string;
}

export default function IconPicker({ value, onChange, category, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggested = getSuggestedIcons(category);
  const allIcons = getIconsForCategory(category);
  const displayIcons = showAll ? allIcons : suggested;

  const SelectedIcon = resolveIcon(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2.5 text-sm text-hotel-900 dark:text-hotel-100 hover:border-gold-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300">
          <SelectedIcon className="h-4 w-4" />
        </span>
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDown className={`h-4 w-4 text-hotel-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[280px] rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-xl overflow-hidden">
          <div className="p-2.5 border-b border-hotel-100 dark:border-dark-border">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2">
              {showAll ? 'All Icons' : 'Suggested'}
            </p>
            <div className="grid grid-cols-6 gap-1">
              {displayIcons.map((iconName) => {
                const Icon = resolveIcon(iconName);
                const isSelected = iconName === value;
                const isSuggested = suggested.includes(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() => { onChange(iconName); setOpen(false); }}
                    className={`flex flex-col items-center gap-0.5 rounded-lg p-1.5 transition-all ${
                      isSelected
                        ? 'bg-gold-600 text-white ring-2 ring-gold-400'
                        : showAll && !isSuggested
                          ? 'text-hotel-400 hover:bg-hotel-50 dark:hover:bg-dark-bg hover:text-hotel-600 dark:hover:text-hotel-300'
                          : 'text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-dark-bg hover:text-hotel-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span className="text-[8px] leading-tight truncate w-full text-center">{iconName}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="w-full px-3 py-2 text-xs font-medium text-gold-600 hover:bg-hotel-50 dark:hover:bg-dark-bg transition-colors text-center"
          >
            {showAll ? `Show suggested (${suggested.length})` : `Show all icons (${allIcons.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
