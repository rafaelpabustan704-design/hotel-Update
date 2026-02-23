import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    siteSettings: db.siteSettings,
    navigation: db.navigation,
    heroContent: db.heroContent,
    aboutContent: db.aboutContent,
    restaurants: db.restaurants,
    signatureDishes: db.signatureDishes,
    diningHighlights: db.diningHighlights,
    amenities: db.amenities,
    availabilityContent: db.availabilityContent,
    contactItems: db.contactItems,
    sectionHeaders: db.sectionHeaders,
  });
}
