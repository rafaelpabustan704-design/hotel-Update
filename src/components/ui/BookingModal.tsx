'use client';

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { X, User, Mail, Phone, MessageSquare, BedDouble, Users, Baby } from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { useRoomTypes } from '@/hooks/RoomTypeContext';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { BookingPickerCalendar } from '@/components/ui/Calendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomType?: string;
}

const inputClass =
  'w-full rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-3 text-sm text-hotel-900 dark:text-hotel-100 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors';

export default function BookingModal({ isOpen, onClose, preselectedRoomType }: BookingModalProps) {
  const { reservations, addReservation } = useReservations();
  const { roomTypes } = useRoomTypes();
  const { siteSettings } = useLandingContent();

  const [submitted, setSubmitted] = useState(false);

  const defaultRoomType = roomTypes[0]?.name || '';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: defaultRoomType,
    adults: 1,
    children: 0,
    specialRequests: '',
  });

  const guestLimits = useMemo(() => {
    const rt = roomTypes.find((t) => t.name === form.roomType);
    return rt ? { maxAdults: rt.maxAdults, maxChildren: rt.maxChildren } : { maxAdults: 4, maxChildren: 4 };
  }, [form.roomType, roomTypes]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      adults: Math.min(prev.adults, guestLimits.maxAdults) || 1,
      children: Math.min(prev.children, guestLimits.maxChildren),
    }));
  }, [guestLimits]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setForm({
          fullName: '', email: '', phone: '', checkIn: '', checkOut: '',
          roomType: roomTypes[0]?.name || '', adults: 1, children: 0, specialRequests: '',
        });
      }, 200);
      return () => clearTimeout(timer);
    } else if (preselectedRoomType) {
      setForm((prev) => ({ ...prev, roomType: preselectedRoomType }));
    }
  }, [isOpen, roomTypes, preselectedRoomType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'adults') {
      const num = value === '' ? 0 : parseInt(value) || 0;
      setForm((prev) => ({ ...prev, adults: Math.max(1, Math.min(num, guestLimits.maxAdults)) }));
      return;
    }
    if (name === 'children') {
      const num = value === '' ? 0 : parseInt(value) || 0;
      setForm((prev) => ({ ...prev, children: Math.max(0, Math.min(num, guestLimits.maxChildren)) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (checkIn: string, checkOut: string) => setForm((prev) => ({ ...prev, checkIn, checkOut }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut) return;
    if (form.adults < 1) return;
    addReservation({
      fullName: form.fullName, email: form.email, phone: form.phone,
      checkIn: form.checkIn, checkOut: form.checkOut, roomType: form.roomType,
      adults: Number(form.adults), children: Number(form.children), specialRequests: form.specialRequests,
    });
    setSubmitted(true);
  };

  if (!isOpen) return null;
  const datesSelected = form.checkIn && form.checkOut;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-modal-overlay" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-white to-stone-50 dark:from-dark-card dark:to-dark-bg shadow-2xl animate-modal-content">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-hotel-900 px-6 py-5 rounded-t-2xl">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Book Your Stay</h2>
            <p className="text-sm text-hotel-400 mt-0.5">Pick your dates on the calendar, then fill in your details</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-hotel-300 transition-colors hover:bg-white/20 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 text-green-500">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white mb-3">Reservation Confirmed!</h3>
            <p className="text-hotel-500 dark:text-hotel-400 mb-8 max-w-md mx-auto leading-relaxed">Thank you for choosing {siteSettings.name}. A confirmation email will be sent to your inbox shortly.</p>
            <button onClick={onClose} className="rounded-full bg-gold-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-700">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10">
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/30 dark:bg-dark-bg/50 p-4">
                <BookingPickerCalendar reservations={reservations} roomTypes={roomTypes} checkIn={form.checkIn} checkOut={form.checkOut} onDateChange={handleDateChange} />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><User className="h-4 w-4 text-hotel-400" />Full Name</label><input type="text" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Juan Dela Cruz" className={inputClass} /></div>
                  <div><label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><Mail className="h-4 w-4 text-hotel-400" />Email</label><input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="juan@example.com" className={inputClass} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><Phone className="h-4 w-4 text-hotel-400" />Phone</label><input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+63 917 123 4567" className={inputClass} /></div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><BedDouble className="h-4 w-4 text-hotel-400" />Room Type</label>
                    <select name="roomType" value={form.roomType} onChange={handleChange} className={inputClass}>
                      {roomTypes.map((rt) => (
                        <option key={rt.id} value={rt.name}>{rt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div><label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300"><MessageSquare className="h-4 w-4 text-hotel-400" />Special Requests <span className="text-hotel-400 font-normal">(optional)</span></label><textarea name="specialRequests" rows={2} value={form.specialRequests} onChange={handleChange} placeholder="Any special requirements..." className={`${inputClass} resize-none`} /></div>
                <div className="flex items-center gap-2 rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 px-4 py-3">
                  <Users className="h-4 w-4 text-gold-600" />
                  <span className="text-sm text-hotel-700 dark:text-hotel-300 font-medium">Max {guestLimits.maxAdults + guestLimits.maxChildren} guests</span>
                  <span className="text-xs text-hotel-400">({guestLimits.maxAdults} adults, {guestLimits.maxChildren} children)</span>
                </div>
                {!datesSelected && <p className="text-xs text-gold-600 bg-gold-50 dark:bg-gold-900/20 rounded-lg px-3 py-2 flex items-center gap-2"><svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Please select your check-in and check-out dates on the calendar</p>}
                <button type="submit" disabled={!datesSelected} className={`w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 ${datesSelected ? 'bg-gold-600 shadow-gold-600/25 hover:bg-gold-700 hover:shadow-gold-700/30' : 'bg-hotel-300 dark:bg-hotel-700 shadow-none cursor-not-allowed'}`}>Confirm Reservation</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
