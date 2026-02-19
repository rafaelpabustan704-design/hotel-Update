'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { HotelSettings } from '@/utils/types';

const DEFAULT_SETTINGS: HotelSettings = {
  name: 'Grand Horizon Hotel',
  address: '123 Ocean Boulevard, Coastal City, CA 90210',
};

interface HotelSettingsContextType {
  settings: HotelSettings;
  updateSettings: (data: Partial<HotelSettings>) => void;
}

const HotelSettingsContext = createContext<HotelSettingsContextType | undefined>(undefined);

export function HotelSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HotelSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {});
  }, []);

  const updateSettings = useCallback((data: Partial<HotelSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...data };
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
      return updated;
    });
  }, []);

  return (
    <HotelSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </HotelSettingsContext.Provider>
  );
}

export function useHotelSettings() {
  const context = useContext(HotelSettingsContext);
  if (!context) {
    throw new Error('useHotelSettings must be used within a HotelSettingsProvider');
  }
  return context;
}
