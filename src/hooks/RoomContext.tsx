'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ManagedRoom } from '@/types';
import { useCrudCollection } from '@/providers/hooks/useCrudResource';

interface RoomContextType {
  rooms: ManagedRoom[];
  addRoom: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  updateRoom: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  deleteRoom: (id: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const { items, add, update, remove } = useCrudCollection<ManagedRoom>({ basePath: '/api/rooms' });

  return (
    <RoomContext.Provider value={{
      rooms: items,
      addRoom: (data) => { add(data as Omit<ManagedRoom, 'id'>); },
      updateRoom: (id, data) => { update(id, data); },
      deleteRoom: (id) => { remove(id); },
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) throw new Error('useRooms must be used within a RoomProvider');
  return context;
}
