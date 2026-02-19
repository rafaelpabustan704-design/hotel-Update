'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { RoomType } from '@/utils/types';

interface RoomTypeContextType {
  roomTypes: RoomType[];
  addRoomType: (data: Omit<RoomType, 'id' | 'createdAt'>) => void;
  updateRoomType: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => void;
  deleteRoomType: (id: string) => { success: boolean; error?: string };
}

const RoomTypeContext = createContext<RoomTypeContextType | undefined>(undefined);

export const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', hex: '#3b82f6', hexBg: '#eff6ff', hexText: '#1d4ed8' },
  { value: 'purple', label: 'Purple', hex: '#a855f7', hexBg: '#faf5ff', hexText: '#7e22ce' },
  { value: 'amber', label: 'Amber', hex: '#f59e0b', hexBg: '#fffbeb', hexText: '#b45309' },
  { value: 'green', label: 'Green', hex: '#22c55e', hexBg: '#f0fdf4', hexText: '#15803d' },
  { value: 'red', label: 'Red', hex: '#ef4444', hexBg: '#fef2f2', hexText: '#b91c1c' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4', hexBg: '#ecfeff', hexText: '#0e7490' },
  { value: 'pink', label: 'Pink', hex: '#ec4899', hexBg: '#fdf2f8', hexText: '#be185d' },
  { value: 'orange', label: 'Orange', hex: '#f97316', hexBg: '#fff7ed', hexText: '#c2410c' },
  { value: 'indigo', label: 'Indigo', hex: '#6366f1', hexBg: '#eef2ff', hexText: '#4338ca' },
  { value: 'teal', label: 'Teal', hex: '#14b8a6', hexBg: '#f0fdfa', hexText: '#0f766e' },
];

const FALLBACK = { value: 'gray', label: 'Gray', hex: '#6b7280', hexBg: '#f9fafb', hexText: '#374151' };

export function getColorClasses(color: string) {
  return COLOR_OPTIONS.find((c) => c.value === color) || FALLBACK;
}

export function RoomTypeProvider({ children }: { children: ReactNode }) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    fetch('/api/room-types')
      .then((res) => res.json())
      .then((data) => setRoomTypes(data))
      .catch(() => {});
  }, []);

  const addRoomType = useCallback((data: Omit<RoomType, 'id' | 'createdAt'>) => {
    fetch('/api/room-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((created: RoomType) => {
        setRoomTypes((prev) => [...prev, created]);
      })
      .catch(() => {});
  }, []);

  const updateRoomType = useCallback((id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt'>>) => {
    fetch(`/api/room-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((updated: RoomType) => {
        setRoomTypes((prev) => prev.map((rt) => (rt.id === id ? updated : rt)));
      })
      .catch(() => {});
  }, []);

  const deleteRoomType = useCallback((id: string): { success: boolean; error?: string } => {
    if (roomTypes.length <= 1) {
      return { success: false, error: 'Cannot delete the last room type' };
    }

    fetch(`/api/room-types/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
        }
      })
      .catch(() => {});

    return { success: true };
  }, [roomTypes.length]);

  return (
    <RoomTypeContext.Provider value={{ roomTypes, addRoomType, updateRoomType, deleteRoomType }}>
      {children}
    </RoomTypeContext.Provider>
  );
}

export function useRoomTypes() {
  const context = useContext(RoomTypeContext);
  if (!context) {
    throw new Error('useRoomTypes must be used within a RoomTypeProvider');
  }
  return context;
}
