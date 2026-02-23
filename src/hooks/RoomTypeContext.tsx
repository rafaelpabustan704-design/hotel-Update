'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { RoomType } from '@/types';
import { useCrudCollection } from '@/providers/hooks/useCrudResource';

export { COLOR_OPTIONS, getColorClasses } from '@/utils/colors';

interface RoomTypeContextType {
  roomTypes: RoomType[];
  addRoomType: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  updateRoomType: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  deleteRoomType: (id: string) => { success: boolean; error?: string };
}

const RoomTypeContext = createContext<RoomTypeContextType | undefined>(undefined);

export function RoomTypeProvider({ children }: { children: ReactNode }) {
  const { items, add, update, remove } = useCrudCollection<RoomType>({ basePath: '/api/room-types' });

  const deleteRoomType = useCallback((id: string): { success: boolean; error?: string } => {
    if (items.length <= 1) return { success: false, error: 'Cannot delete the last room type' };
    remove(id);
    return { success: true };
  }, [items.length, remove]);

  return (
    <RoomTypeContext.Provider value={{
      roomTypes: items,
      addRoomType: (data) => { add(data as Omit<RoomType, 'id'>); },
      updateRoomType: (id, data) => { update(id, data); },
      deleteRoomType,
    }}>
      {children}
    </RoomTypeContext.Provider>
  );
}

export function useRoomTypes() {
  const context = useContext(RoomTypeContext);
  if (!context) throw new Error('useRoomTypes must be used within a RoomTypeProvider');
  return context;
}
