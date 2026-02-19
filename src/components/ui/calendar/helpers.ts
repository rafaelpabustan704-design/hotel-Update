import type { Reservation, DiningReservation } from '@/utils/types';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Return YYYY-MM-DD for a Date (local timezone) */
export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Get all calendar cells for a month view (includes leading/trailing days) */
export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();

  const days: { date: Date; currentMonth: boolean }[] = [];

  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, currentMonth: false });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true });
  }

  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
  }

  return days;
}

/**
 * Build a map: dateString -> Reservation[] for a given month.
 * Includes both check-in and check-out dates so the full stay range is visible.
 */
export function buildReservationMap(
  reservations: Reservation[],
  year: number,
  month: number,
): Map<string, Reservation[]> {
  const map = new Map<string, Reservation[]>();
  const monthStart = toDateStr(new Date(year, month, 1));
  const monthEnd = toDateStr(new Date(year, month + 1, 0));

  for (const r of reservations) {
    if (r.checkOut < monthStart || r.checkIn > monthEnd) continue;

    const start = new Date(r.checkIn + 'T00:00:00');
    const end = new Date(r.checkOut + 'T00:00:00');
    const firstOfMonth = new Date(year, month, 1);
    const firstOfNextMonth = new Date(year, month + 1, 1);

    const cursor = new Date(Math.max(start.getTime(), firstOfMonth.getTime()));
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

/** Build a map: dateString -> DiningReservation[] for a given month. */
export function buildDiningReservationMap(
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
