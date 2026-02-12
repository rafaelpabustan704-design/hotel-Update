'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, BedDouble, CheckCircle2, XCircle } from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { CustomerCalendar } from '@/components/ui/Calendar';
import { ROOM_INVENTORY } from '@/constants/hotel';

interface AvailabilityProps {
  onBookNow: () => void;
}

export default function Availability({ onBookNow }: AvailabilityProps) {
  const { reservations } = useReservations();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  /* Track the date selected on the calendar */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /* The date we compute availability for — selected date or today */
  const targetDate = selectedDate || todayStr;
  const isToday = targetDate === todayStr;

  const availability = useMemo(() => {
    return ROOM_INVENTORY.map((room) => {
      const booked = reservations.filter(
        (r) => r.roomType === room.name && r.checkIn <= targetDate && r.checkOut >= targetDate
      ).length;
      const available = Math.max(0, room.total - booked);
      return { ...room, booked, available };
    });
  }, [reservations, targetDate]);

  const totalAvailable = availability.reduce((sum, r) => sum + r.available, 0);
  const totalRooms = ROOM_INVENTORY.reduce((sum, r) => sum + r.total, 0);

  const formattedTarget = new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section id="availability" className="scroll-mt-20 py-24 bg-hotel-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600 mb-3">
            Plan Your Visit
          </p>
          <h2 className="font-serif text-4xl font-bold text-hotel-900 mb-4">
            Check Availability
          </h2>
          <p className="mx-auto max-w-2xl text-hotel-500 leading-relaxed">
            Browse our reservation calendar to find the perfect dates for your stay.
            Click on any date to see available rooms.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
          {/* Calendar */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
            <CustomerCalendar
              reservations={reservations}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Side info */}
          <div className="flex flex-col gap-6">
            {/* Real-time availability */}
            <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <BedDouble className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-hotel-900">
                    {isToday ? "Today's Availability" : 'Availability'}
                  </h3>
                  <p className="text-sm text-hotel-500">
                    {!isToday && (
                      <span className="font-semibold text-hotel-700">{formattedTarget} &middot; </span>
                    )}
                    <span className="font-semibold text-emerald-600">{totalAvailable}</span> of {totalRooms} rooms available
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {availability.map((room) => (
                  <div key={room.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${room.dot}`} />
                      <span className="text-sm text-hotel-700">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {room.available > 0 ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600">{room.available}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-sm font-semibold text-red-500">Full</span>
                        </>
                      )}
                      <span className="text-xs text-hotel-400">/ {room.total}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hint */}
              {isToday && (
                <p className="mt-4 pt-3 border-t border-hotel-100 text-xs text-hotel-400 text-center">
                  Click a date on the calendar to check its availability
                </p>
              )}
            </div>

            {/* Booking Info legend */}
            <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-hotel-900">Calendar Legend</h3>
                  <p className="text-sm text-hotel-500">How to read the calendar</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-hotel-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <span><strong>Blue dots</strong> — Deluxe Room bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                  <span><strong>Purple dots</strong> — Executive Suite bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span><strong>Amber dots</strong> — Presidential Suite bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-400 shrink-0" />
                  <span><strong>Gold ring</strong> — Today&apos;s date</span>
                </li>
              </ul>
            </div>

            {/* Ready to Book CTA */}
            <div className="flex-1 flex flex-col rounded-2xl bg-gradient-to-br from-hotel-900 to-hotel-800 p-6 text-white">
              <h3 className="font-serif text-lg font-bold mb-2">Ready to Book?</h3>
              <p className="text-sm text-hotel-300 mb-5 leading-relaxed">
                Found your ideal dates? Reserve your room now and experience luxury at Grand Horizon.
              </p>
              <button
                onClick={onBookNow}
                className="mt-auto w-full rounded-xl bg-gold-600 py-3 text-sm font-semibold text-white transition-all hover:bg-gold-500 active:scale-[0.98]"
              >
                Make a Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
