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

  useEffect(() => {
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => {});
  }, []);

  const addReservation = useCallback(
    (data: Omit<Reservation, 'id' | 'createdAt'>) => {
      const body = {
        fullName: String(data.fullName ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        checkIn: String(data.checkIn ?? ''),
        checkOut: String(data.checkOut ?? ''),
        roomType: String(data.roomType ?? ''),
        adults: Number(data.adults) || 0,
        children: Number(data.children) || 0,
        specialRequests: String(data.specialRequests ?? ''),
      };

      fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((created: Reservation) => {
          setReservations((prev) => [...prev, created]);
        })
        .catch(() => {});
    },
    [],
  );

  const deleteReservation = useCallback(
    (id: string) => {
      fetch(`/api/reservations/${id}`, { method: 'DELETE' })
        .then(() => {
          setReservations((prev) => prev.filter((r) => r.id !== id));
        })
        .catch(() => {});
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
