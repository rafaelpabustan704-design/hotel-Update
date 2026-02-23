'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { DiningReservation } from '@/types';
import { useCrudCollection } from '@/providers/hooks/useCrudResource';

interface DiningReservationContextType {
  diningReservations: DiningReservation[];
  addDiningReservation: (reservation: Omit<DiningReservation, 'id' | 'createdAt'>) => void;
  deleteDiningReservation: (id: string) => void;
}

const DiningReservationContext = createContext<DiningReservationContextType | undefined>(undefined);

export function DiningReservationProvider({ children }: { children: ReactNode }) {
  const { items, add, remove } = useCrudCollection<DiningReservation>({ basePath: '/api/dining-reservations' });

  return (
    <DiningReservationContext.Provider value={{
      diningReservations: items,
      addDiningReservation: (data) => { add(data as Omit<DiningReservation, 'id'>); },
      deleteDiningReservation: (id) => { remove(id); },
    }}>
      {children}
    </DiningReservationContext.Provider>
  );
}

export function useDiningReservations() {
  const context = useContext(DiningReservationContext);
  if (!context) throw new Error('useDiningReservations must be used within a DiningReservationProvider');
  return context;
}
