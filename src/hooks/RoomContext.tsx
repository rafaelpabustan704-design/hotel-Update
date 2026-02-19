'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ManagedRoom } from '@/utils/types';

interface RoomContextType {
  rooms: ManagedRoom[];
  addRoom: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  updateRoom: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  deleteRoom: (id: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<ManagedRoom[]>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch(() => {});
  }, []);

  const addRoom = useCallback((data: Omit<ManagedRoom, 'id' | 'createdAt'>) => {
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((created: ManagedRoom) => {
        setRooms((prev) => [...prev, created]);
      })
      .catch(() => {});
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => {
    fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((updated: ManagedRoom) => {
        setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
      })
      .catch(() => {});
  }, []);

  const deleteRoom = useCallback((id: string) => {
    fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      .then(() => {
        setRooms((prev) => prev.filter((r) => r.id !== id));
      })
      .catch(() => {});
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, addRoom, updateRoom, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
}
