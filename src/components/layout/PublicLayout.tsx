'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { ReservationProvider } from '@/hooks/ReservationContext';
import { DiningReservationProvider } from '@/hooks/DiningReservationContext';
import { RoomTypeProvider } from '@/hooks/RoomTypeContext';
import { RoomProvider } from '@/hooks/RoomContext';
import { LandingContentProvider } from '@/hooks/LandingContentContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/ui/BookingModal';
import DiningReservationModal from '@/components/ui/DiningReservationModal';

interface BookingUIContextType {
  openBooking: (roomType?: string) => void;
  openDining: (restaurant?: string) => void;
}

const BookingUIContext = createContext<BookingUIContextType>({
  openBooking: () => {},
  openDining: () => {},
});

export function useBookingUI() {
  return useContext(BookingUIContext);
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [diningOpen, setDiningOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  const openBooking = (roomType?: string | unknown) => {
    setSelectedRoomType(typeof roomType === 'string' ? roomType : '');
    setBookingOpen(true);
  };
  const openDining = (restaurant?: string | unknown) => {
    setSelectedRestaurant(typeof restaurant === 'string' ? restaurant : '');
    setDiningOpen(true);
  };

  return (
    <LandingContentProvider>
      <RoomTypeProvider>
        <RoomProvider>
          <ReservationProvider>
            <DiningReservationProvider>
              <BookingUIContext.Provider value={{ openBooking, openDining }}>
                <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors">
                  <Navbar onBookNow={openBooking} />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} preselectedRoomType={selectedRoomType} />
                  <DiningReservationModal isOpen={diningOpen} onClose={() => setDiningOpen(false)} preselectedRestaurant={selectedRestaurant} />
                </div>
              </BookingUIContext.Provider>
            </DiningReservationProvider>
          </ReservationProvider>
        </RoomProvider>
      </RoomTypeProvider>
    </LandingContentProvider>
  );
}
