'use client';

import { createContext, useContext, useCallback, useState, useMemo, type ReactNode } from 'react';
import type { ManagedRoom } from '@/types';
import { useCrudCollection } from '@/providers/hooks/useCrudResource';

interface RoomContextType {
  rooms: ManagedRoom[];
  setDraftRoom: (id: string, data: Partial<ManagedRoom> | null) => void;
  addRoom: (data: Omit<ManagedRoom, 'id' | 'createdAt'>) => void;
  updateRoom: (id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => void;
  deleteRoom: (id: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const { items, add, update, remove } = useCrudCollection<ManagedRoom>({ basePath: '/api/rooms' });
  const [draftOverrides, setDraftOverrides] = useState<Record<string, Partial<ManagedRoom>>>({});

  const rooms = useMemo(() => items.map((r) => ({ ...r, ...draftOverrides[r.id] })), [items, draftOverrides]);

  const setDraftRoom = useCallback((id: string, data: Partial<ManagedRoom> | null) => {
    setDraftOverrides((prev) => {
      const next = { ...prev };
      if (data == null) delete next[id];
      else next[id] = { ...prev[id], ...data };
      return next;
    });
  }, []);

  const updateRoomAndClearDraft = useCallback((id: string, data: Partial<Omit<ManagedRoom, 'id' | 'createdAt'>>) => {
    update(id, data);
    setDraftOverrides((p) => { const n = { ...p }; delete n[id]; return n; });
  }, [update]);

  return (
    <RoomContext.Provider value={{
      rooms,
      setDraftRoom,
      addRoom: (data) => { add(data as Omit<ManagedRoom, 'id'>); },
      updateRoom: updateRoomAndClearDraft,
      deleteRoom: (id) => { remove(id); setDraftOverrides((p) => { const n = { ...p }; delete n[id]; return n; }); },
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
