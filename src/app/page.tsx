'use client';

import Hero from '@/features/Hero';
import About from '@/features/About';
import Rooms from '@/features/Rooms';
import Dining from '@/features/Dining';
import Availability from '@/features/Availability';
import Amenities from '@/features/Amenities';
import Contact from '@/features/Contact';
import { useBookingUI } from '@/components/layout/ClientLayout';

export default function HomePage() {
  const { openBooking, openDining } = useBookingUI();

  return (
    <>
      <Hero onBookNow={openBooking} onReserveTable={openDining} />
      <About />
      <Rooms onBookNow={openBooking} />
      <Dining onReserveTable={openDining} />
      <Availability onBookNow={openBooking} />
      <Amenities />
      <Contact />
    </>
  );
}
