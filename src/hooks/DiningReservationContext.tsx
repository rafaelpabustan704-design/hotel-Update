'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { DiningReservation } from '@/utils/types';

interface DiningReservationContextType {
  diningReservations: DiningReservation[];
  addDiningReservation: (reservation: Omit<DiningReservation, 'id' | 'createdAt'>) => void;
  deleteDiningReservation: (id: string) => void;
}

const DiningReservationContext = createContext<DiningReservationContextType | undefined>(undefined);

export function DiningReservationProvider({ children }: { children: ReactNode }) {
  const [diningReservations, setDiningReservations] = useState<DiningReservation[]>([]);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem('hotel-dining-reservations');
    if (stored) {
      setDiningReservations(JSON.parse(stored));
    }
  }, []);

  const addDiningReservation = useCallback(
    (data: Omit<DiningReservation, 'id' | 'createdAt'>) => {
      // Explicitly pick only primitive fields to prevent DOM references leaking in
      const newReservation: DiningReservation = {
        id: crypto.randomUUID(),
        fullName: String(data.fullName ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        restaurant: String(data.restaurant ?? ''),
        date: String(data.date ?? ''),
        time: String(data.time ?? ''),
        adults: Number(data.adults) || 0,
        children: Number(data.children) || 0,
        specialRequests: String(data.specialRequests ?? ''),
        createdAt: new Date().toISOString(),
      };
      setDiningReservations((prev) => {
        const updated = [...prev, newReservation];
        localStorage.setItem('hotel-dining-reservations', JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const deleteDiningReservation = useCallback(
    (id: string) => {
      setDiningReservations((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        localStorage.setItem('hotel-dining-reservations', JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return (
    <DiningReservationContext.Provider
      value={{ diningReservations, addDiningReservation, deleteDiningReservation }}
    >
      {children}
    </DiningReservationContext.Provider>
  );
}

export function useDiningReservations() {
  const context = useContext(DiningReservationContext);
  if (!context) {
    throw new Error('useDiningReservations must be used within a DiningReservationProvider');
  }
  return context;
}
