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

  useEffect(() => {
    fetch('/api/dining-reservations')
      .then((res) => res.json())
      .then((data) => setDiningReservations(data))
      .catch(() => {});
  }, []);

  const addDiningReservation = useCallback(
    (data: Omit<DiningReservation, 'id' | 'createdAt'>) => {
      const body = {
        fullName: String(data.fullName ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        restaurant: String(data.restaurant ?? ''),
        date: String(data.date ?? ''),
        time: String(data.time ?? ''),
        adults: Number(data.adults) || 0,
        children: Number(data.children) || 0,
        specialRequests: String(data.specialRequests ?? ''),
      };

      fetch('/api/dining-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((created: DiningReservation) => {
          setDiningReservations((prev) => [...prev, created]);
        })
        .catch(() => {});
    },
    [],
  );

  const deleteDiningReservation = useCallback(
    (id: string) => {
      fetch(`/api/dining-reservations/${id}`, { method: 'DELETE' })
        .then(() => {
          setDiningReservations((prev) => prev.filter((r) => r.id !== id));
        })
        .catch(() => {});
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
