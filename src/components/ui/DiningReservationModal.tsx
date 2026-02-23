'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { X, User, Mail, Phone, MessageSquare, Users, Baby, UtensilsCrossed, Clock } from 'lucide-react';
import { useDiningReservations } from '@/hooks/DiningReservationContext';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { TIME_SLOTS } from '@/utils/room-features';
import { DiningPickerCalendar } from '@/components/ui/Calendar';

interface DiningReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRestaurant?: string;
}

const inputClass =
  'w-full rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-3 text-sm text-hotel-900 dark:text-hotel-100 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors';

export default function DiningReservationModal({
  isOpen,
  onClose,
  preselectedRestaurant,
}: DiningReservationModalProps) {
  const { addDiningReservation } = useDiningReservations();
  const { restaurants } = useLandingContent();
  const restaurantNames = restaurants.map((r) => r.name);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    restaurant: preselectedRestaurant || restaurantNames[0] || '',
    date: '',
    time: '19:00',
    adults: 2,
    children: 0,
    specialRequests: '',
  });

  // Update restaurant when preselected changes
  useEffect(() => {
    if (preselectedRestaurant) {
      setForm((prev) => ({ ...prev, restaurant: preselectedRestaurant }));
    }
  }, [preselectedRestaurant]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setForm({
          fullName: '',
          email: '',
          phone: '',
          restaurant: preselectedRestaurant || restaurantNames[0] || '',
          date: '',
          time: '19:00',
          adults: 2,
          children: 0,
          specialRequests: '',
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, preselectedRestaurant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const numberFields = ['adults', 'children'];
    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? (value === '' ? 0 : Math.max(0, parseInt(value) || 0)) : value,
    }));
  };

  const handleDateChange = (date: string) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time) return;
    if (form.adults < 1) return;
    addDiningReservation({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      restaurant: form.restaurant,
      date: form.date,
      time: form.time,
      adults: Number(form.adults),
      children: Number(form.children),
      specialRequests: form.specialRequests,
    });
    setSubmitted(true);
  };

  if (!isOpen) return null;

  const dateSelected = !!form.date;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-modal-overlay"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-white to-stone-50 dark:from-dark-card dark:to-dark-bg shadow-2xl animate-modal-content">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-hotel-900 px-6 py-5 rounded-t-2xl">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Reserve a Table</h2>
            <p className="text-sm text-hotel-400 mt-0.5">
              Pick your date on the calendar, then fill in your details
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-hotel-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 text-green-500">
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white mb-3">
              Table Reserved!
            </h3>
            <p className="text-hotel-500 dark:text-hotel-400 mb-8 max-w-md mx-auto leading-relaxed">
              Your table at <span className="font-semibold text-hotel-700 dark:text-hotel-200">{form.restaurant}</span> has
              been confirmed. We look forward to welcoming you.
            </p>
            <button
              onClick={onClose}
              className="rounded-full bg-gold-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-700"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-10">
            {/* Two-column layout matching BookingModal */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left panel — Calendar + Restaurant/Time */}
              <div className="lg:col-span-2 rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/30 dark:bg-dark-bg/50 p-4">
                {/* Restaurant selector */}
                <div className="mb-4">
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500 dark:text-hotel-400 uppercase tracking-wider">
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    Restaurant
                  </label>
                  <select
                    name="restaurant"
                    value={form.restaurant}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {restaurantNames.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Calendar date picker */}
                <DiningPickerCalendar
                  selectedDate={form.date}
                  onDateChange={handleDateChange}
                />

                {/* Time selector */}
                <div className="mt-4">
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500 dark:text-hotel-400 uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    Time
                  </label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right panel — Guest details */}
              <div className="lg:col-span-3 space-y-6">
                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                      <User className="h-4 w-4 text-hotel-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Juan Dela Cruz"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                      <Mail className="h-4 w-4 text-hotel-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="juan@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                    <Phone className="h-4 w-4 text-hotel-400" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+63 917 123 4567"
                    className={inputClass}
                  />
                </div>

                {/* Adults & Children */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                      <Users className="h-4 w-4 text-hotel-400" />
                      Adults
                    </label>
                    <input
                      type="number"
                      name="adults"
                      required
                      min={1}
                      value={form.adults}
                      onChange={handleChange}
                      placeholder="2"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                      <Baby className="h-4 w-4 text-hotel-400" />
                      Children
                    </label>
                    <input
                      type="number"
                      name="children"
                      min={0}
                      value={form.children}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300">
                    <MessageSquare className="h-4 w-4 text-hotel-400" />
                    Special Requests{' '}
                    <span className="text-hotel-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="specialRequests"
                    rows={2}
                    value={form.specialRequests}
                    onChange={handleChange}
                    placeholder="Dietary requirements, seating preferences..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Date validation message */}
                {!dateSelected && (
                  <p className="text-xs text-gold-600 bg-gold-50 dark:bg-gold-900/20 rounded-lg px-3 py-2 flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please select a date on the calendar for your reservation
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!dateSelected}
                  className={`w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 ${
                    dateSelected
                      ? 'bg-gold-600 shadow-gold-600/25 hover:bg-gold-700 hover:shadow-gold-700/30'
                      : 'bg-hotel-300 dark:bg-hotel-700 shadow-none cursor-not-allowed'
                  }`}
                >
                  Confirm Table Reservation
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
