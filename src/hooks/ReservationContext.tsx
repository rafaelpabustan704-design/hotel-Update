'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Reservation } from '@/types';
import { useCrudCollection } from '@/providers/hooks/useCrudResource';

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  deleteReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const { items, add, remove } = useCrudCollection<Reservation>({ basePath: '/api/reservations' });

  return (
    <ReservationContext.Provider value={{
      reservations: items,
      addReservation: (data) => { add(data as Omit<Reservation, 'id'>); },
      deleteReservation: (id) => { remove(id); },
    }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error('useReservations must be used within a ReservationProvider');
  return context;
}
