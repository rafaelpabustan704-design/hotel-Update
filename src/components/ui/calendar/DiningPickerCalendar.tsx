'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS, MONTHS, toDateStr, getCalendarDays } from './helpers';

interface DiningPickerCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DiningPickerCalendar({
  selectedDate,
  onDateChange,
}: DiningPickerCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const todayStr = toDateStr(today);

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const handleDayClick = (dateStr: string) => {
    if (dateStr < todayStr) return;
    onDateChange(dateStr);
  };

  return (
    <div>
      {/* Selected date indicator */}
      <div className="mb-4">
        <div
          className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
            selectedDate
              ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 ring-2 ring-gold-500/20'
              : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg'
          }`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Date</span>
          <span className={`block font-semibold mt-0.5 ${selectedDate ? 'text-hotel-900 dark:text-hotel-100' : 'text-hotel-300'}`}>
            {selectedDate
              ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Select a date'}
          </span>
        </div>
      </div>

      {/* Clear date button */}
      {selectedDate && (
        <button
          type="button"
          onClick={() => onDateChange('')}
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg py-1.5 text-xs font-medium text-hotel-500 dark:text-hotel-400 transition-colors hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Date
        </button>
      )}

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="text-sm font-bold text-hotel-900 dark:text-hotel-100">
          {MONTHS[month]} {year}
        </h4>
        <button
          type="button"
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-hotel-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(({ date, currentMonth }, i) => {
          const dateStr = toDateStr(date);
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selectedDate;
          const isDisabled = !currentMonth || isPast;

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isDisabled && handleDayClick(dateStr)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center justify-center rounded-lg py-1.5 min-h-[40px] transition-all text-xs
                ${isDisabled ? 'text-hotel-300 dark:text-hotel-600 opacity-40 cursor-default' : 'cursor-pointer'}
                ${!isDisabled && !isSelected ? 'hover:bg-hotel-50 dark:hover:bg-hotel-800' : ''}
                ${isSelected ? 'bg-gold-600 text-white font-bold shadow-sm' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-gold-400 ring-inset' : ''}
                ${currentMonth && !isPast && !isSelected ? 'text-hotel-700 dark:text-hotel-200' : ''}
              `}
            >
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="h-3 w-3 rounded bg-gold-600" />
          Selected
        </div>
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="h-3 w-3 rounded ring-1 ring-gold-400" />
          Today
        </div>
      </div>
    </div>
  );
}
