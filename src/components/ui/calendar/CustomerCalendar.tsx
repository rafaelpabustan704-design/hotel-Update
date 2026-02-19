'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reservation, RoomType } from '@/utils/types';
import { getRoomColor } from '@/constants/hotel';
import { getColorClasses } from '@/hooks/RoomTypeContext';
import { DAYS, MONTHS, toDateStr, getCalendarDays, buildReservationMap } from './helpers';

interface CustomerCalendarProps {
  reservations: Reservation[];
  roomTypes?: RoomType[];
  onDateSelect?: (dateStr: string | null) => void;
}

export function CustomerCalendar({ reservations, roomTypes, onDateSelect }: CustomerCalendarProps) {
  const colorFor = (roomTypeName: string) => {
    const stat = getRoomColor(roomTypeName);
    if (stat.hex !== '#6b7280') return stat;
    const rt = roomTypes?.find((t) => t.name === roomTypeName);
    if (rt) return getColorClasses(rt.color);
    return stat;
  };

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (dateStr: string | null) => {
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const resMap = useMemo(() => buildReservationMap(reservations, year, month), [reservations, year, month]);
  const todayStr = toDateStr(today);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white">
          {MONTHS[month]} {year}
        </h3>
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider text-hotel-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, currentMonth }, i) => {
          const dateStr = toDateStr(date);
          const dayReservations = resMap.get(dateStr) || [];
          const hasBooking = dayReservations.length > 0;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isPast = dateStr < todayStr;

          return (
            <button
              key={i}
              onClick={() => currentMonth && handleDateSelect(isSelected ? null : dateStr)}
              disabled={!currentMonth}
              className={`
                relative flex flex-col items-center justify-start rounded-xl py-2 min-h-[60px] sm:min-h-[72px] transition-all text-sm
                ${!currentMonth ? 'text-hotel-200 dark:text-hotel-700 cursor-default' : 'cursor-pointer'}
                ${currentMonth && !isSelected ? 'hover:bg-hotel-50 dark:hover:bg-hotel-800' : ''}
                ${isSelected ? 'bg-hotel-900 text-white shadow-lg' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-gold-400 ring-inset' : ''}
                ${currentMonth && isPast && !isSelected ? 'text-hotel-300 dark:text-hotel-600 opacity-40' : ''}
                ${currentMonth && !isPast && !isSelected ? 'text-hotel-800 dark:text-hotel-200' : ''}
              `}
            >
              <span className={`font-medium ${isToday && !isSelected ? 'text-gold-600' : ''}`}>
                {date.getDate()}
              </span>
              {hasBooking && currentMonth && (
                <div className="flex items-center gap-0.5 mt-1">
                  {dayReservations.slice(0, 3).map((r, j) => {
                    const color = colorFor(r.roomType);
                    return (
                      <span
                        key={j}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                  {dayReservations.length > 3 && (
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-white/70' : 'text-hotel-400'}`}>
                      +{dayReservations.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {roomTypes ? roomTypes.map((rt) => {
          const cc = getColorClasses(rt.color);
          return (
            <div key={rt.id} className="flex items-center gap-1.5 text-xs text-hotel-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cc.hex }} />
              {rt.name}
            </div>
          );
        }) : null}
      </div>

      {/* Booking tips */}
      <div className="mt-6 rounded-xl bg-hotel-50 dark:bg-dark-bg border border-hotel-100 dark:border-dark-border p-5">
        <h4 className="text-sm font-semibold text-hotel-800 dark:text-hotel-200 mb-3">Booking Tips</h4>
        <ul className="space-y-2 text-xs text-hotel-500 dark:text-hotel-400 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 rounded-full bg-gold-500 shrink-0" />
            Click any date to check room availability on the sidebar
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 rounded-full bg-gold-500 shrink-0" />
            Colored dots indicate existing bookings for that day
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 rounded-full bg-gold-500 shrink-0" />
            Weekday stays often have more availability
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 rounded-full bg-gold-500 shrink-0" />
            Book early for weekends and holidays to secure your preferred room
          </li>
        </ul>
      </div>
    </div>
  );
}
