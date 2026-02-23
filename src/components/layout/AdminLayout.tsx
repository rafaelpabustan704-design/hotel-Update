'use client';

import type { ReactNode } from 'react';
import { LandingContentProvider } from '@/hooks/LandingContentContext';
import { ReservationProvider } from '@/hooks/ReservationContext';
import { DiningReservationProvider } from '@/hooks/DiningReservationContext';
import { RoomTypeProvider } from '@/hooks/RoomTypeContext';
import { RoomProvider } from '@/hooks/RoomContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <LandingContentProvider>
      <RoomTypeProvider>
        <RoomProvider>
          <ReservationProvider>
            <DiningReservationProvider>
              {children}
            </DiningReservationProvider>
          </ReservationProvider>
        </RoomProvider>
      </RoomTypeProvider>
    </LandingContentProvider>
  );
}
