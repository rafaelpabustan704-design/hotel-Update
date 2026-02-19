'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ReservationProvider } from '@/hooks/ReservationContext';
import { DiningReservationProvider } from '@/hooks/DiningReservationContext';
import { RoomTypeProvider } from '@/hooks/RoomTypeContext';
import { RoomProvider } from '@/hooks/RoomContext';
import { HotelSettingsProvider } from '@/hooks/HotelSettingsContext';
import { ThemeProvider } from '@/hooks/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/ui/BookingModal';
import DiningReservationModal from '@/components/ui/DiningReservationModal';

/* ------------------------------------------------------------------ */
/*  Booking UI context – lets any page / component trigger modals      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Client Layout                                                      */
/* ------------------------------------------------------------------ */

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [diningOpen, setDiningOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  const openBooking = (roomType?: string) => {
    setSelectedRoomType(roomType || '');
    setBookingOpen(true);
  };
  const openDining = (restaurant?: string) => {
    setSelectedRestaurant(restaurant || '');
    setDiningOpen(true);
  };

  const providers = (content: ReactNode) => (
    <ThemeProvider>
      <HotelSettingsProvider>
        <RoomTypeProvider>
          <RoomProvider>
            <ReservationProvider>
              <DiningReservationProvider>
                {content}
              </DiningReservationProvider>
            </ReservationProvider>
          </RoomProvider>
        </RoomTypeProvider>
      </HotelSettingsProvider>
    </ThemeProvider>
  );

  if (isAdmin) {
    return providers(children);
  }

  return providers(
    <BookingUIContext.Provider value={{ openBooking, openDining }}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors">
        <Navbar onBookNow={openBooking} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} preselectedRoomType={selectedRoomType} />
        <DiningReservationModal
          isOpen={diningOpen}
          onClose={() => setDiningOpen(false)}
          preselectedRestaurant={selectedRestaurant}
        />
      </div>
    </BookingUIContext.Provider>
  );
}
