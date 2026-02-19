'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reservation, RoomType } from '@/utils/types';
import { getRoomColor } from '@/constants/hotel';
import { getColorClasses } from '@/hooks/RoomTypeContext';
import { DAYS, MONTHS, toDateStr, getCalendarDays, buildReservationMap } from './helpers';

interface BookingPickerCalendarProps {
  reservations: Reservation[];
  roomTypes?: RoomType[];
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
}

export function BookingPickerCalendar({
  reservations,
  roomTypes,
  checkIn,
  checkOut,
  onDateChange,
}: BookingPickerCalendarProps) {
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
  const [picking, setPicking] = useState<'checkIn' | 'checkOut'>('checkIn');

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const resMap = useMemo(
    () => buildReservationMap(reservations, year, month),
    [reservations, year, month],
  );
  const todayStr = toDateStr(today);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const handleDayClick = (dateStr: string) => {
    if (dateStr < todayStr) return;

    if (picking === 'checkIn') {
      if (checkOut && dateStr >= checkOut) {
        onDateChange(dateStr, '');
      } else {
        onDateChange(dateStr, checkOut);
      }
      setPicking('checkOut');
    } else {
      if (dateStr <= checkIn) {
        onDateChange(dateStr, '');
        setPicking('checkOut');
      } else {
        onDateChange(checkIn, dateStr);
        setPicking('checkIn');
      }
    }
  };

  return (
    <div>
      {/* Picking indicator */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setPicking('checkIn')}
          className={`flex-1 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
            picking === 'checkIn'
              ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 ring-2 ring-gold-500/20'
              : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg'
          }`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Check-in</span>
          <span className={`block font-semibold mt-0.5 ${checkIn ? 'text-hotel-900 dark:text-hotel-100' : 'text-hotel-300'}`}>
            {checkIn
              ? new Date(checkIn + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Select date'}
          </span>
        </button>
        <div className="text-hotel-300 text-xs font-bold">&rarr;</div>
        <button
          type="button"
          onClick={() => checkIn && setPicking('checkOut')}
          className={`flex-1 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
            picking === 'checkOut'
              ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 ring-2 ring-gold-500/20'
              : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg'
          } ${!checkIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Check-out</span>
          <span className={`block font-semibold mt-0.5 ${checkOut ? 'text-hotel-900 dark:text-hotel-100' : 'text-hotel-300'}`}>
            {checkOut
              ? new Date(checkOut + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Select date'}
          </span>
        </button>
      </div>

      {/* Clear dates button */}
      {(checkIn || checkOut) && (
        <button
          type="button"
          onClick={() => {
            onDateChange('', '');
            setPicking('checkIn');
          }}
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg py-1.5 text-xs font-medium text-hotel-500 dark:text-hotel-400 transition-colors hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Dates
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
          const dayReservations = resMap.get(dateStr) || [];
          const hasBooking = dayReservations.length > 0;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const isCheckIn = dateStr === checkIn;
          const isCheckOut = dateStr === checkOut;
          const isInRange =
            checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
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
                ${!isDisabled && !isCheckIn && !isCheckOut && !isInRange ? 'hover:bg-hotel-50 dark:hover:bg-hotel-800' : ''}
                ${isCheckIn ? 'bg-gold-600 text-white font-bold shadow-sm' : ''}
                ${isCheckOut ? 'bg-hotel-900 text-white font-bold shadow-sm' : ''}
                ${isInRange ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-800 dark:text-gold-300' : ''}
                ${isToday && !isCheckIn && !isCheckOut && !isInRange ? 'ring-1 ring-gold-400 ring-inset' : ''}
                ${currentMonth && !isPast && !isCheckIn && !isCheckOut && !isInRange ? 'text-hotel-700 dark:text-hotel-200' : ''}
              `}
            >
              <span>{date.getDate()}</span>
              {hasBooking && currentMonth && (
                <div className="flex items-center gap-px mt-0.5">
                  {dayReservations.slice(0, 3).map((r, j) => {
                    const color = colorFor(r.roomType);
                    return (
                      <span
                        key={j}
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="h-3 w-3 rounded bg-gold-600" />
          Check-in
        </div>
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="h-3 w-3 rounded bg-hotel-900" />
          Check-out
        </div>
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="h-3 w-3 rounded bg-gold-100" />
          Your stay
        </div>
        <div className="flex items-center gap-1 text-[10px] text-hotel-500">
          <span className="flex gap-px">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          </span>
          Booked
        </div>
      </div>
    </div>
  );
}
