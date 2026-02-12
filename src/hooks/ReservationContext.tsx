'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Reservation } from '@/utils/types';

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  deleteReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem('hotel-reservations');
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  const addReservation = useCallback(
    (data: Omit<Reservation, 'id' | 'createdAt'>) => {
      // Explicitly pick only primitive fields to prevent DOM references leaking in
      const newReservation: Reservation = {
        id: crypto.randomUUID(),
        fullName: String(data.fullName ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        checkIn: String(data.checkIn ?? ''),
        checkOut: String(data.checkOut ?? ''),
        roomType: String(data.roomType ?? ''),
        adults: Number(data.adults) || 0,
        children: Number(data.children) || 0,
        specialRequests: String(data.specialRequests ?? ''),
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => {
        const updated = [...prev, newReservation];
        localStorage.setItem('hotel-reservations', JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const deleteReservation = useCallback(
    (id: string) => {
      setReservations((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        localStorage.setItem('hotel-reservations', JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return (
    <ReservationContext.Provider value={{ reservations, addReservation, deleteReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
}
