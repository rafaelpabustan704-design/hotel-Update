'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ReservationProvider } from '@/hooks/ReservationContext';
import { DiningReservationProvider } from '@/hooks/DiningReservationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/ui/BookingModal';
import DiningReservationModal from '@/components/ui/DiningReservationModal';

/* ------------------------------------------------------------------ */
/*  Booking UI context – lets any page / component trigger modals      */
/* ------------------------------------------------------------------ */

interface BookingUIContextType {
  openBooking: () => void;
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
  const [diningOpen, setDiningOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  const openBooking = () => setBookingOpen(true);
  const openDining = (restaurant?: string) => {
    setSelectedRestaurant(restaurant || '');
    setDiningOpen(true);
  };

  // Admin pages get a minimal shell – only the context providers, no
  // client Navbar / Footer / booking modals.
  if (isAdmin) {
    return (
      <ReservationProvider>
        <DiningReservationProvider>
          {children}
        </DiningReservationProvider>
      </ReservationProvider>
    );
  }

  // Client pages get the full experience
  return (
    <ReservationProvider>
      <DiningReservationProvider>
        <BookingUIContext.Provider value={{ openBooking, openDining }}>
          <div className="min-h-screen flex flex-col">
            <Navbar onBookNow={openBooking} />
            <main className="flex-1">{children}</main>
            <Footer />
            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
            <DiningReservationModal
              isOpen={diningOpen}
              onClose={() => setDiningOpen(false)}
              preselectedRestaurant={selectedRestaurant}
            />
          </div>
        </BookingUIContext.Provider>
      </DiningReservationProvider>
    </ReservationProvider>
  );
}
