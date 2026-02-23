'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, BedDouble, CheckCircle2, XCircle } from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { useRoomTypes, getColorClasses } from '@/hooks/RoomTypeContext';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { useTemplateResolver } from '@/providers/hooks/useTemplateResolver';
import { CustomerCalendar } from '@/components/ui/Calendar';

interface AvailabilityProps {
  onBookNow: () => void;
}

export default function Availability({ onBookNow }: AvailabilityProps) {
  const { reservations } = useReservations();
  const { roomTypes } = useRoomTypes();
  const { availabilityContent } = useLandingContent();
  const t = useTemplateResolver();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const targetDate = selectedDate || todayStr;
  const isToday = targetDate === todayStr;

  const availability = useMemo(() => {
    return roomTypes.map((rt) => {
      const cc = getColorClasses(rt.color);
      const booked = reservations.filter(
        (r) => r.roomType === rt.name && r.checkIn <= targetDate && r.checkOut >= targetDate
      ).length;
      const available = Math.max(0, rt.totalRooms - booked);
      return { name: rt.name, total: rt.totalRooms, hex: cc.hex, booked, available };
    });
  }, [roomTypes, reservations, targetDate]);

  const totalAvailable = availability.reduce((sum, r) => sum + r.available, 0);
  const totalRooms = roomTypes.reduce((sum, r) => sum + r.totalRooms, 0);

  const formattedTarget = new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section id="availability" className="scroll-mt-20 py-24 bg-hotel-50 dark:bg-dark-bg transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">{availabilityContent.sectionLabel || 'Plan Your Visit'}</p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 dark:text-white mb-4">{availabilityContent.sectionTitle || 'Check Availability'}</h2>
          <p className="mx-auto max-w-2xl text-hotel-500 dark:text-hotel-400 leading-relaxed">
            {t(availabilityContent.description || 'Browse our reservation calendar to find the perfect dates for your stay.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-sm p-6">
            <CustomerCalendar reservations={reservations} roomTypes={roomTypes} onDateSelect={setSelectedDate} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"><BedDouble className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-hotel-900 dark:text-white">{isToday ? (availabilityContent.todayLabel || "Today's Availability") : 'Availability'}</h3>
                  <p className="text-sm text-hotel-500 dark:text-hotel-400">
                    {!isToday && <span className="font-semibold text-hotel-700 dark:text-hotel-300">{formattedTarget} &middot; </span>}
                    <span className="font-semibold text-emerald-600">{totalAvailable}</span> of {totalRooms} rooms available
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {availability.map((room) => (
                  <div key={room.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: room.hex }} />
                      <span className="text-sm text-hotel-700 dark:text-hotel-300">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {room.available > 0 ? (
                        <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-sm font-semibold text-emerald-600">{room.available}</span></>
                      ) : (
                        <><XCircle className="h-3.5 w-3.5 text-red-400" /><span className="text-sm font-semibold text-red-500">Full</span></>
                      )}
                      <span className="text-xs text-hotel-400">/ {room.total}</span>
                    </div>
                  </div>
                ))}
              </div>
              {isToday && <p className="mt-4 pt-3 border-t border-hotel-100 dark:border-dark-border text-xs text-hotel-400 text-center">Click a date on the calendar to check its availability</p>}
            </div>

            <div className="rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400"><CalendarDays className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-hotel-900 dark:text-white">{availabilityContent.legendLabel || 'Calendar Legend'}</h3>
                  <p className="text-sm text-hotel-500 dark:text-hotel-400">How to read the calendar</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-hotel-600 dark:text-hotel-300">
                {roomTypes.map((rt) => {
                  const cc = getColorClasses(rt.color);
                  return (
                    <li key={rt.id} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cc.hex }} />
                      <span><strong>{cc.label} dots</strong> — {rt.name} bookings</span>
                    </li>
                  );
                })}
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-400 shrink-0" />
                  <span><strong>Gold ring</strong> — Today&apos;s date</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 flex flex-col rounded-2xl bg-gradient-to-br from-hotel-900 to-hotel-800 p-6 text-white">
              <h3 className="font-serif text-lg font-bold mb-2">{availabilityContent.readyTitle || 'Ready to Book?'}</h3>
              <p className="text-sm text-hotel-300 mb-5 leading-relaxed">{t(availabilityContent.readyDescription || 'Found your ideal dates? Reserve your room now and experience luxury at {{hotelName}}.')}</p>
              <button onClick={onBookNow} className="mt-auto w-full rounded-xl bg-gold-600 py-3 text-sm font-semibold text-white transition-all hover:bg-gold-500 active:scale-[0.98]">{availabilityContent.ctaButtonText || 'Make a Reservation'}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
