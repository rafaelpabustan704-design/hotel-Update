'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, BedDouble, Users, User, CalendarDays } from 'lucide-react';
import type { Reservation, RoomType } from '@/types';
import { getRoomColor } from '@/utils/room-features';
import { getColorClasses } from '@/hooks/RoomTypeContext';
import { DAYS, MONTHS, toDateStr, getCalendarDays, buildReservationMap } from './helpers';

interface AdminCalendarProps {
  reservations: Reservation[];
  roomTypes?: RoomType[];
  onDeleteReservation: (id: string) => void;
  onDateSelect?: (date: string | null) => void;
}

export function AdminCalendar({ reservations, roomTypes, onDeleteReservation, onDateSelect }: AdminCalendarProps) {
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
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(todayStr);
    onDateSelect?.(todayStr);
  };

  const handleDateClick = (dateStr: string) => {
    const newDate = selectedDate === dateStr ? null : dateStr;
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const selectedReservations = selectedDate ? (resMap.get(selectedDate) || []) : [];

  const monthBookingCount = useMemo(() => {
    const seen = new Set<string>();
    resMap.forEach((list) => list.forEach((r) => seen.add(r.id)));
    return seen.size;
  }, [resMap]);

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-hotel-100 dark:border-dark-border">
        <div>
          <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white">
            {MONTHS[month]} {year}
          </h3>
          <p className="text-sm text-hotel-500 dark:text-hotel-400 mt-0.5">
            {monthBookingCount} reservation{monthBookingCount !== 1 ? 's' : ''} this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="rounded-lg bg-gold-50 dark:bg-gold-900/30 px-3 py-1.5 text-xs font-semibold text-gold-700 dark:text-gold-400 transition-colors hover:bg-gold-100 dark:hover:bg-gold-900/50"
          >
            Today
          </button>
          <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 transition-colors hover:bg-hotel-100 dark:hover:bg-hotel-700">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider text-hotel-400 py-3">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map(({ date, currentMonth }, i) => {
          const dateStr = toDateStr(date);
          const dayReservations = resMap.get(dateStr) || [];
          const hasBooking = dayReservations.length > 0;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              onClick={() => currentMonth && handleDateClick(dateStr)}
              disabled={!currentMonth}
              className={`
                relative flex flex-col items-start p-2 min-h-[80px] sm:min-h-[96px] border-b border-r border-hotel-100/50 dark:border-dark-border/50 transition-all text-left
                ${!currentMonth ? 'bg-hotel-50/30 dark:bg-dark-bg/30 text-hotel-200 dark:text-hotel-700' : 'cursor-pointer hover:bg-hotel-50/50 dark:hover:bg-hotel-800/50'}
                ${isSelected ? 'bg-gold-50 dark:bg-gold-900/20 ring-2 ring-inset ring-gold-400' : ''}
              `}
            >
              <span
                className={`
                  text-sm font-medium mb-1
                  ${isToday ? 'flex h-7 w-7 items-center justify-center rounded-full bg-gold-600 text-white' : ''}
                  ${!isToday && currentMonth ? 'text-hotel-700 dark:text-hotel-300' : ''}
                `}
              >
                {date.getDate()}
              </span>
              {hasBooking && currentMonth && (
                <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                  {dayReservations.slice(0, 2).map((r) => {
                    const color = colorFor(r.roomType);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center gap-1 rounded px-1.5 py-0.5"
                        style={{ backgroundColor: color.hexBg }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
                        <span className="text-[10px] font-medium truncate" style={{ color: color.hexText }}>
                          {r.fullName.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                  {dayReservations.length > 2 && (
                    <span className="text-[10px] text-hotel-400 font-medium px-1.5">
                      +{dayReservations.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-hotel-100 dark:border-dark-border flex flex-wrap gap-4 bg-hotel-50/30 dark:bg-dark-bg/30">
        {roomTypes ? roomTypes.map((rt) => {
          const cc = getColorClasses(rt.color);
          return (
            <div key={rt.id} className="flex items-center gap-1.5 text-xs text-hotel-500 dark:text-hotel-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cc.hex }} />
              {rt.name}
            </div>
          );
        }) : null}
      </div>

      {/* Selected day detail panel */}
      {selectedDate && (
        <div className="border-t border-hotel-100 dark:border-dark-border bg-white dark:bg-dark-card px-6 py-5">
          <h4 className="font-semibold text-hotel-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gold-600" />
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
            <span className="ml-auto text-sm font-normal text-hotel-400">
              {selectedReservations.length} booking{selectedReservations.length !== 1 ? 's' : ''}
            </span>
          </h4>

          {selectedReservations.length === 0 ? (
            <p className="text-sm text-hotel-500 dark:text-hotel-400 text-center py-4">No reservations on this date.</p>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r) => {
                const color = colorFor(r.roomType);
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-hotel-100 dark:border-dark-border p-4"
                    style={{ backgroundColor: color.hexBg }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-hotel-700 font-bold text-sm shadow-sm">
                          {r.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-hotel-900 text-sm truncate">{r.fullName}</p>
                          <p className="text-xs text-hotel-500 truncate">{r.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this reservation?')) {
                            onDeleteReservation(r.id);
                          }
                        }}
                        className="shrink-0 text-hotel-400 hover:text-red-500 transition-colors p-1"
                        title="Delete reservation"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <BedDouble className="h-3.5 w-3.5 text-hotel-400" />
                        {r.roomType}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <Users className="h-3.5 w-3.5 text-hotel-400" />
                        {r.adults} adult{r.adults !== 1 ? 's' : ''}{r.children > 0 && `, ${r.children} child${r.children !== 1 ? 'ren' : ''}`}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <CalendarDays className="h-3.5 w-3.5 text-hotel-400" />
                        {new Date(r.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}&ndash;{' '}
                        {new Date(r.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <User className="h-3.5 w-3.5 text-hotel-400" />
                        {r.phone}
                      </div>
                    </div>
                    {r.specialRequests && (
                      <p className="mt-2 text-xs text-hotel-500 italic">&quot;{r.specialRequests}&quot;</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
