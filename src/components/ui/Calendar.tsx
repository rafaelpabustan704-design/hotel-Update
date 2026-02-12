'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, BedDouble, Users, User, CalendarDays, UtensilsCrossed, Clock } from 'lucide-react';
import type { Reservation, DiningReservation } from '@/utils/types';
import { ROOM_COLORS, getRoomColor, RESTAURANT_COLORS, getRestaurantColor } from '@/constants/hotel';

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Return YYYY-MM-DD for a Date (local timezone) */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Get all calendar cells for a month view (includes leading/trailing days) */
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0-6

  const days: { date: Date; currentMonth: boolean }[] = [];

  // Leading days from previous month
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, currentMonth: false });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true });
  }

  // Trailing days to fill last week
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
  }

  return days;
}

/** Build a map: dateString -> Reservation[] for a given month.
 *  Includes both check-in and check-out dates so the full stay range is visible. */
function buildReservationMap(
  reservations: Reservation[],
  year: number,
  month: number,
): Map<string, Reservation[]> {
  const map = new Map<string, Reservation[]>();
  const monthStart = toDateStr(new Date(year, month, 1));
  const monthEnd = toDateStr(new Date(year, month + 1, 0));

  for (const r of reservations) {
    // Skip reservations that don't overlap this month at all
    if (r.checkOut < monthStart || r.checkIn > monthEnd) continue;

    // Walk each day from check-in through check-out (inclusive)
    const start = new Date(r.checkIn + 'T00:00:00');
    const end = new Date(r.checkOut + 'T00:00:00');
    const firstOfMonth = new Date(year, month, 1);
    const firstOfNextMonth = new Date(year, month + 1, 1);

    const cursor = new Date(Math.max(start.getTime(), firstOfMonth.getTime()));
    // Include checkout day: use end + 1 day as the limit
    const dayAfterEnd = new Date(end.getTime());
    dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
    const limit = new Date(Math.min(dayAfterEnd.getTime(), firstOfNextMonth.getTime()));

    while (cursor < limit) {
      const key = toDateStr(cursor);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Customer-facing calendar                                           */
/* ------------------------------------------------------------------ */

interface CustomerCalendarProps {
  reservations: Reservation[];
  onDateSelect?: (dateStr: string | null) => void;
}

export function CustomerCalendar({ reservations, onDateSelect }: CustomerCalendarProps) {
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
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-serif text-xl font-bold text-hotel-900">
          {MONTHS[month]} {year}
        </h3>
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-xl bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
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
                ${!currentMonth ? 'text-hotel-200 cursor-default' : 'cursor-pointer'}
                ${currentMonth && !isSelected ? 'hover:bg-hotel-50' : ''}
                ${isSelected ? 'bg-hotel-900 text-white shadow-lg' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-gold-400 ring-inset' : ''}
                ${currentMonth && isPast && !isSelected ? 'text-hotel-300' : ''}
                ${currentMonth && !isPast && !isSelected ? 'text-hotel-800' : ''}
              `}
            >
              <span className={`font-medium ${isToday && !isSelected ? 'text-gold-600' : ''}`}>
                {date.getDate()}
              </span>
              {hasBooking && currentMonth && (
                <div className="flex items-center gap-0.5 mt-1">
                  {dayReservations.slice(0, 3).map((r, j) => {
                    const color = getRoomColor(r.roomType);
                    return (
                      <span
                        key={j}
                        className={`h-1.5 w-1.5 rounded-full ${color.dot}`}
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
        {Object.entries(ROOM_COLORS).map(([room, color]) => (
          <div key={room} className="flex items-center gap-1.5 text-xs text-hotel-500">
            <span className={`h-2 w-2 rounded-full ${color.dot}`} />
            {room}
          </div>
        ))}
      </div>

      {/* Booking tips */}
      <div className="mt-6 rounded-xl bg-hotel-50 border border-hotel-100 p-5">
        <h4 className="text-sm font-semibold text-hotel-800 mb-3">Booking Tips</h4>
        <ul className="space-y-2 text-xs text-hotel-500 leading-relaxed">
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

/* ------------------------------------------------------------------ */
/*  Booking picker calendar (for reservation modal)                    */
/* ------------------------------------------------------------------ */

interface BookingPickerCalendarProps {
  reservations: Reservation[];
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
}

export function BookingPickerCalendar({
  reservations,
  checkIn,
  checkOut,
  onDateChange,
}: BookingPickerCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  /** 'checkIn' = next click sets check-in, 'checkOut' = next click sets check-out */
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
    if (dateStr < todayStr) return; // can't pick past dates

    if (picking === 'checkIn') {
      // If new check-in is after current check-out, reset check-out
      if (checkOut && dateStr >= checkOut) {
        onDateChange(dateStr, '');
      } else {
        onDateChange(dateStr, checkOut);
      }
      setPicking('checkOut');
    } else {
      // picking checkOut
      if (dateStr <= checkIn) {
        // Clicked before check-in — treat as new check-in
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
              ? 'border-gold-500 bg-gold-50 ring-2 ring-gold-500/20'
              : 'border-hotel-200 bg-white'
          }`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Check-in</span>
          <span className={`block font-semibold mt-0.5 ${checkIn ? 'text-hotel-900' : 'text-hotel-300'}`}>
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
              ? 'border-gold-500 bg-gold-50 ring-2 ring-gold-500/20'
              : 'border-hotel-200 bg-white'
          } ${!checkIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Check-out</span>
          <span className={`block font-semibold mt-0.5 ${checkOut ? 'text-hotel-900' : 'text-hotel-300'}`}>
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
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-hotel-200 bg-white py-1.5 text-xs font-medium text-hotel-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
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
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="text-sm font-bold text-hotel-900">
          {MONTHS[month]} {year}
        </h4>
        <button
          type="button"
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100"
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
                ${isDisabled ? 'text-hotel-200 cursor-default' : 'cursor-pointer'}
                ${!isDisabled && !isCheckIn && !isCheckOut && !isInRange ? 'hover:bg-hotel-50' : ''}
                ${isCheckIn ? 'bg-gold-600 text-white font-bold shadow-sm' : ''}
                ${isCheckOut ? 'bg-hotel-900 text-white font-bold shadow-sm' : ''}
                ${isInRange ? 'bg-gold-100 text-gold-800' : ''}
                ${isToday && !isCheckIn && !isCheckOut && !isInRange ? 'ring-1 ring-gold-400 ring-inset' : ''}
                ${currentMonth && !isPast && !isCheckIn && !isCheckOut && !isInRange ? 'text-hotel-700' : ''}
              `}
            >
              <span>{date.getDate()}</span>
              {hasBooking && currentMonth && (
                <div className="flex items-center gap-px mt-0.5">
                  {dayReservations.slice(0, 3).map((r, j) => {
                    const color = getRoomColor(r.roomType);
                    return (
                      <span
                        key={j}
                        className={`h-1 w-1 rounded-full ${color.dot}`}
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

/* ------------------------------------------------------------------ */
/*  Dining picker calendar (single-date, for dining reservation modal) */
/* ------------------------------------------------------------------ */

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
              ? 'border-gold-500 bg-gold-50 ring-2 ring-gold-500/20'
              : 'border-hotel-200 bg-white'
          }`}
        >
          <span className="block text-hotel-400 font-medium uppercase tracking-wider text-[10px]">Date</span>
          <span className={`block font-semibold mt-0.5 ${selectedDate ? 'text-hotel-900' : 'text-hotel-300'}`}>
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
          className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-hotel-200 bg-white py-1.5 text-xs font-medium text-hotel-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
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
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="text-sm font-bold text-hotel-900">
          {MONTHS[month]} {year}
        </h4>
        <button
          type="button"
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100"
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
                ${isDisabled ? 'text-hotel-200 cursor-default' : 'cursor-pointer'}
                ${!isDisabled && !isSelected ? 'hover:bg-hotel-50' : ''}
                ${isSelected ? 'bg-gold-600 text-white font-bold shadow-sm' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-gold-400 ring-inset' : ''}
                ${currentMonth && !isPast && !isSelected ? 'text-hotel-700' : ''}
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

/* ------------------------------------------------------------------ */
/*  Admin calendar                                                     */
/* ------------------------------------------------------------------ */

interface AdminCalendarProps {
  reservations: Reservation[];
  onDeleteReservation: (id: string) => void;
  onDateSelect?: (date: string | null) => void;
}

export function AdminCalendar({ reservations, onDeleteReservation, onDateSelect }: AdminCalendarProps) {
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

  // Count total bookings this month
  const monthBookingCount = useMemo(() => {
    const seen = new Set<string>();
    resMap.forEach((list) => list.forEach((r) => seen.add(r.id)));
    return seen.size;
  }, [resMap]);

  return (
    <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-hotel-100">
        <div>
          <h3 className="font-serif text-xl font-bold text-hotel-900">
            {MONTHS[month]} {year}
          </h3>
          <p className="text-sm text-hotel-500 mt-0.5">
            {monthBookingCount} reservation{monthBookingCount !== 1 ? 's' : ''} this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="rounded-lg bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-100"
          >
            Today
          </button>
          <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-hotel-100 bg-hotel-50/50">
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
                relative flex flex-col items-start p-2 min-h-[80px] sm:min-h-[96px] border-b border-r border-hotel-100/50 transition-all text-left
                ${!currentMonth ? 'bg-hotel-50/30 text-hotel-200' : 'cursor-pointer hover:bg-hotel-50/50'}
                ${isSelected ? 'bg-gold-50 ring-2 ring-inset ring-gold-400' : ''}
              `}
            >
              <span
                className={`
                  text-sm font-medium mb-1
                  ${isToday ? 'flex h-7 w-7 items-center justify-center rounded-full bg-gold-600 text-white' : ''}
                  ${!isToday && currentMonth ? 'text-hotel-700' : ''}
                `}
              >
                {date.getDate()}
              </span>
              {hasBooking && currentMonth && (
                <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                  {dayReservations.slice(0, 2).map((r) => {
                    const color = getRoomColor(r.roomType);
                    return (
                      <div
                        key={r.id}
                        className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${color.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                        <span className={`text-[10px] font-medium truncate ${color.text}`}>
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
      <div className="px-6 py-3 border-t border-hotel-100 flex flex-wrap gap-4 bg-hotel-50/30">
        {Object.entries(ROOM_COLORS).map(([room, color]) => (
          <div key={room} className="flex items-center gap-1.5 text-xs text-hotel-500">
            <span className={`h-2 w-2 rounded-full ${color.dot}`} />
            {room}
          </div>
        ))}
      </div>

      {/* Selected day detail panel */}
      {selectedDate && (
        <div className="border-t border-hotel-100 bg-white px-6 py-5">
          <h4 className="font-semibold text-hotel-900 mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gold-600" />
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
            <span className="ml-auto text-sm font-normal text-hotel-400">
              {selectedReservations.length} booking{selectedReservations.length !== 1 ? 's' : ''}
            </span>
          </h4>

          {selectedReservations.length === 0 ? (
            <p className="text-sm text-hotel-500 text-center py-4">No reservations on this date.</p>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r) => {
                const color = getRoomColor(r.roomType);
                return (
                  <div
                    key={r.id}
                    className={`rounded-xl border border-hotel-100 p-4 ${color.bg}`}
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

/* ------------------------------------------------------------------ */
/*  Admin dining calendar                                              */
/* ------------------------------------------------------------------ */

/** Build a map: dateString -> DiningReservation[] for a given month. */
function buildDiningReservationMap(
  reservations: DiningReservation[],
  year: number,
  month: number,
): Map<string, DiningReservation[]> {
  const map = new Map<string, DiningReservation[]>();
  const monthStart = toDateStr(new Date(year, month, 1));
  const monthEnd = toDateStr(new Date(year, month + 1, 0));

  for (const r of reservations) {
    if (r.date < monthStart || r.date > monthEnd) continue;
    if (!map.has(r.date)) map.set(r.date, []);
    map.get(r.date)!.push(r);
  }
  return map;
}

interface AdminDiningCalendarProps {
  diningReservations: DiningReservation[];
  onDeleteReservation: (id: string) => void;
  onDateSelect?: (date: string | null, reservations: DiningReservation[]) => void;
}

export function AdminDiningCalendar({ diningReservations, onDeleteReservation, onDateSelect }: AdminDiningCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const resMap = useMemo(() => buildDiningReservationMap(diningReservations, year, month), [diningReservations, year, month]);
  const todayStr = toDateStr(today);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };
  const handleDateSelect = (dateStr: string | null) => {
    setSelectedDate(dateStr);
    const dayRes = dateStr ? (resMap.get(dateStr) || []) : [];
    onDateSelect?.(dateStr, dayRes);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    handleDateSelect(todayStr);
  };

  const selectedReservations = selectedDate ? (resMap.get(selectedDate) || []) : [];

  // Count total dining bookings this month
  const monthBookingCount = useMemo(() => {
    let count = 0;
    resMap.forEach((list) => { count += list.length; });
    return count;
  }, [resMap]);

  const formatTime = (timeStr: string) =>
    new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-hotel-100">
        <div>
          <h3 className="font-serif text-xl font-bold text-hotel-900">
            {MONTHS[month]} {year}
          </h3>
          <p className="text-sm text-hotel-500 mt-0.5">
            {monthBookingCount} table reservation{monthBookingCount !== 1 ? 's' : ''} this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="rounded-lg bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-100"
          >
            Today
          </button>
          <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-lg bg-hotel-50 text-hotel-600 transition-colors hover:bg-hotel-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-hotel-100 bg-hotel-50/50">
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
              onClick={() => currentMonth && handleDateSelect(isSelected ? null : dateStr)}
              disabled={!currentMonth}
              className={`
                relative flex flex-col items-start p-2 min-h-[80px] sm:min-h-[96px] border-b border-r border-hotel-100/50 transition-all text-left
                ${!currentMonth ? 'bg-hotel-50/30 text-hotel-200' : 'cursor-pointer hover:bg-hotel-50/50'}
                ${isSelected ? 'bg-gold-50 ring-2 ring-inset ring-gold-400' : ''}
              `}
            >
              <span
                className={`
                  text-sm font-medium mb-1
                  ${isToday ? 'flex h-7 w-7 items-center justify-center rounded-full bg-gold-600 text-white' : ''}
                  ${!isToday && currentMonth ? 'text-hotel-700' : ''}
                `}
              >
                {date.getDate()}
              </span>
              {hasBooking && currentMonth && (
                <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                  {dayReservations.slice(0, 2).map((r) => {
                    const color = getRestaurantColor(r.restaurant);
                    return (
                      <div
                        key={r.id}
                        className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${color.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                        <span className={`text-[10px] font-medium truncate ${color.text}`}>
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
      <div className="px-6 py-3 border-t border-hotel-100 flex flex-wrap gap-4 bg-hotel-50/30">
        {Object.entries(RESTAURANT_COLORS).map(([restaurant, color]) => (
          <div key={restaurant} className="flex items-center gap-1.5 text-xs text-hotel-500">
            <span className={`h-2 w-2 rounded-full ${color.dot}`} />
            {restaurant}
          </div>
        ))}
      </div>

      {/* Selected day detail panel */}
      {selectedDate && (
        <div className="border-t border-hotel-100 bg-white px-6 py-5">
          <h4 className="font-semibold text-hotel-900 mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gold-600" />
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
            <span className="ml-auto text-sm font-normal text-hotel-400">
              {selectedReservations.length} reservation{selectedReservations.length !== 1 ? 's' : ''}
            </span>
          </h4>

          {selectedReservations.length === 0 ? (
            <p className="text-sm text-hotel-500 text-center py-4">No dining reservations on this date.</p>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r) => {
                const color = getRestaurantColor(r.restaurant);
                return (
                  <div
                    key={r.id}
                    className={`rounded-xl border border-hotel-100 p-4 ${color.bg}`}
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
                          if (confirm('Delete this dining reservation?')) {
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
                        <UtensilsCrossed className="h-3.5 w-3.5 text-hotel-400" />
                        {r.restaurant}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <Clock className="h-3.5 w-3.5 text-hotel-400" />
                        {formatTime(r.time)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-hotel-600">
                        <Users className="h-3.5 w-3.5 text-hotel-400" />
                        {r.adults} adult{r.adults !== 1 ? 's' : ''}{r.children > 0 && `, ${r.children} child${r.children !== 1 ? 'ren' : ''}`}
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
