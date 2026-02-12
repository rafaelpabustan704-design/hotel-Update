import type { ComponentType } from 'react';
import type { RoomDetail } from '@/utils/types';
import {
  Award,
  Bath,
  BedDouble,
  Briefcase,
  CakeSlice,
  CalendarCheck,
  Car,
  Clock,
  Coffee,
  CreditCard,
  Dumbbell,
  Eye,
  Flame,
  Gem,
  Leaf,
  Mail,
  MapPin,
  Maximize,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Tv,
  UtensilsCrossed,
  Users,
  Waves,
  Wifi,
  Wine,
} from 'lucide-react';

/* ================================================================== */
/*  Navigation                                                         */
/* ================================================================== */

export const NAV_ITEMS = [
  'About', 'Rooms', 'Dining', 'Availability', 'Amenities', 'Contact',
] as const;

/* ================================================================== */
/*  Room Types & Inventory                                             */
/* ================================================================== */

export const ROOM_TYPES = [
  'Deluxe Room', 'Executive Suite', 'Presidential Suite',
] as const;

export const ROOM_INVENTORY = [
  { name: 'Deluxe Room',        total: 10, color: 'blue',   dot: 'bg-blue-500',   bar: 'bg-blue-500' },
  { name: 'Executive Suite',    total: 5,  color: 'purple', dot: 'bg-purple-500', bar: 'bg-purple-500' },
  { name: 'Presidential Suite', total: 2,  color: 'amber',  dot: 'bg-amber-500',  bar: 'bg-amber-500' },
];

/* ================================================================== */
/*  Room Colors (calendar & availability)                              */
/* ================================================================== */

export const ROOM_COLORS: Record<string, { bg: string; dot: string; text: string }> = {
  'Deluxe Room':        { bg: 'bg-blue-50',   dot: 'bg-blue-500',   text: 'text-blue-700' },
  'Executive Suite':    { bg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-700' },
  'Presidential Suite': { bg: 'bg-amber-50',  dot: 'bg-amber-500',  text: 'text-amber-700' },
};

export function getRoomColor(roomType: string) {
  return ROOM_COLORS[roomType] || { bg: 'bg-gray-50', dot: 'bg-gray-500', text: 'text-gray-700' };
}

/* ================================================================== */
/*  Room Guest Limits                                                  */
/* ================================================================== */

export const ROOM_GUEST_LIMITS: Record<string, { maxAdults: number; maxChildren: number }> = {
  'Deluxe Room':        { maxAdults: 2, maxChildren: 2 },
  'Executive Suite':    { maxAdults: 3, maxChildren: 3 },
  'Presidential Suite': { maxAdults: 4, maxChildren: 4 },
};

/* ================================================================== */
/*  Room Features                                                      */
/* ================================================================== */

export const FEATURE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  coffee: Coffee,
  tv: Tv,
  bath: Bath,
  guests: Users,
  size: Maximize,
};

export const FEATURE_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  coffee: 'Coffee',
  tv: 'TV',
  bath: 'Bath',
  guests: 'Family',
  size: 'Spacious',
};

/* ================================================================== */
/*  Room Details                                                       */
/* ================================================================== */

export const ROOMS: RoomDetail[] = [
  {
    id: 1,
    name: 'Deluxe Room',
    tagline: 'Classic Elegance, Modern Comfort',
    description:
      'Elegant comfort with a king-size bed, city views, and premium amenities for the discerning traveler.',
    longDescription:
      'Our Deluxe Room offers the perfect blend of classic elegance and modern comfort. Featuring floor-to-ceiling windows with stunning city views, a plush king-size bed with premium Egyptian cotton linens, and a marble-clad bathroom with rain shower. The room is equipped with a Nespresso machine, a 55-inch smart TV, and high-speed WiFi.',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['wifi', 'coffee', 'tv', 'bath'],
    specs: [
      { icon: BedDouble, label: 'Bed', value: 'King Size' },
      { icon: Ruler, label: 'Size', value: '35 m²' },
      { icon: Eye, label: 'View', value: 'City View' },
      { icon: Users, label: 'Capacity', value: '2 Adults, 2 Children' },
    ],
    inclusions: [
      'Daily breakfast buffet',
      'Welcome drink on arrival',
      'High-speed WiFi',
      'Daily housekeeping',
      'Access to fitness center',
      'In-room safe & minibar',
    ],
  },
  {
    id: 2,
    name: 'Executive Suite',
    tagline: 'Elevated Luxury, Panoramic Views',
    description:
      'Spacious luxury with a separate living area, panoramic views, and exclusive lounge access.',
    longDescription:
      'The Executive Suite redefines luxury living with a spacious separate lounge area, a private bedroom with a premium king-size bed, and floor-to-ceiling panoramic windows offering breathtaking views. Enjoy exclusive access to our Executive Lounge with complimentary evening cocktails, a marble bathroom with soaking tub and rain shower, and a fully-stocked premium minibar.',
    price: 20000,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['wifi', 'coffee', 'tv', 'bath', 'guests'],
    specs: [
      { icon: BedDouble, label: 'Bed', value: 'King Size' },
      { icon: Ruler, label: 'Size', value: '60 m²' },
      { icon: Eye, label: 'View', value: 'Panoramic' },
      { icon: Users, label: 'Capacity', value: '3 Adults, 3 Children' },
    ],
    inclusions: [
      'Daily breakfast buffet',
      'Executive Lounge access',
      'Evening cocktails & canapés',
      'Nespresso machine & premium minibar',
      'Complimentary pressing service',
      'Late checkout (subject to availability)',
      'Soaking tub & rain shower',
      'Turndown service',
    ],
  },
  {
    id: 3,
    name: 'Presidential Suite',
    tagline: 'The Pinnacle of Opulence',
    description:
      'The pinnacle of opulence featuring a private terrace, butler service, and bespoke furnishings.',
    longDescription:
      'Our Presidential Suite is the ultimate expression of luxury. Spanning an impressive 120 m², it features a grand living room, a private dining area for six, a master bedroom with a handcrafted canopy bed, and a sprawling private terrace with a jacuzzi. Enjoy dedicated 24-hour butler service, a Bose surround sound system, a walk-in wardrobe, and a marble bathroom with both a freestanding tub and a glass-enclosed rain shower.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['wifi', 'coffee', 'tv', 'bath', 'guests', 'size'],
    specs: [
      { icon: BedDouble, label: 'Bed', value: 'Canopy King' },
      { icon: Ruler, label: 'Size', value: '120 m²' },
      { icon: Eye, label: 'View', value: 'Ocean & City' },
      { icon: Users, label: 'Capacity', value: '4 Adults, 4 Children' },
    ],
    inclusions: [
      '24-hour dedicated butler service',
      'Daily breakfast in-suite or restaurant',
      'Airport limousine transfer',
      'Private terrace with jacuzzi',
      'Premium bar & Champagne selection',
      'Complimentary spa treatment (60 min)',
      'Bose surround sound system',
      'Walk-in wardrobe & pressing service',
      'Priority restaurant reservations',
      'Late checkout guaranteed',
    ],
  },
];

/* ================================================================== */
/*  Restaurants & Dining                                               */
/* ================================================================== */

export const RESTAURANT_NAMES = [
  'The Ocean Terrace', 'Sakura Garden', 'La Dolce Vita',
] as const;

export const RESTAURANTS = [
  {
    name: 'The Ocean Terrace',
    cuisine: 'Mediterranean & Seafood',
    hours: 'Dinner · 6:00 PM – 11:00 PM',
    description:
      'Fresh-caught seafood and Mediterranean classics served on our open-air terrace overlooking the coast. Signature dishes include grilled lobster and saffron risotto.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    tags: ['Seafood', 'Fine Dining', 'Ocean View'],
  },
  {
    name: 'Sakura Garden',
    cuisine: 'Japanese & Asian Fusion',
    hours: 'Lunch & Dinner · 12:00 PM – 10:00 PM',
    description:
      'An authentic Japanese dining experience featuring omakase sushi, wagyu teppanyaki, and handcrafted ramen in an elegant zen-inspired setting.',
    image:
      'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80',
    tags: ['Japanese', 'Sushi', 'Teppanyaki'],
  },
  {
    name: 'La Dolce Vita',
    cuisine: 'Italian & Artisan Pizza',
    hours: 'All Day · 11:00 AM – 11:00 PM',
    description:
      'Authentic wood-fired pizzas, house-made pastas, and classic Italian desserts crafted with imported ingredients from Tuscany and Naples.',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    tags: ['Italian', 'Pizza', 'Family-Friendly'],
  },
];

export const RESTAURANT_COLORS: Record<string, { bg: string; dot: string; text: string }> = {
  'The Ocean Terrace': { bg: 'bg-cyan-50', dot: 'bg-cyan-500', text: 'text-cyan-700' },
  'Sakura Garden':     { bg: 'bg-pink-50', dot: 'bg-pink-500', text: 'text-pink-700' },
  'La Dolce Vita':     { bg: 'bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-700' },
};

export function getRestaurantColor(restaurant: string) {
  return RESTAURANT_COLORS[restaurant] || { bg: 'bg-gray-50', dot: 'bg-gray-500', text: 'text-gray-700' };
}

export const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '18:00', '18:30', '19:00', '19:30', '20:00',
  '20:30', '21:00', '21:30', '22:00',
];

export const FOOD_GALLERY = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    title: 'Grilled Herb-Crusted Lamb',
    desc: 'Served with roasted vegetables and rosemary jus',
  },
  {
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    title: 'Garden Fresh Salad Bowl',
    desc: 'Seasonal greens with citrus vinaigrette and edible flowers',
  },
  {
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    title: 'Fluffy Ricotta Pancakes',
    desc: 'Topped with fresh berries, maple syrup, and whipped cream',
  },
  {
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80',
    title: 'Artisan Brunch Platter',
    desc: 'House-smoked salmon, poached eggs, and sourdough toast',
  },
  {
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80',
    title: 'Pâtisserie Selection',
    desc: 'Hand-crafted French pastries and seasonal petit fours',
  },
];

export const DINING_HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'Farm to Table',
    desc: 'Locally sourced ingredients from partner farms and fisheries',
  },
  {
    icon: Wine,
    title: 'Curated Wine List',
    desc: '300+ labels from world-renowned vineyards and cellars',
  },
  {
    icon: Leaf,
    title: 'Dietary Options',
    desc: 'Vegan, gluten-free, and allergy-friendly menus available',
  },
  {
    icon: CakeSlice,
    title: 'Pastry Bar',
    desc: 'Freshly baked artisan breads, croissants, and French pastries',
  },
];

/* ================================================================== */
/*  Amenities                                                          */
/* ================================================================== */

export const AMENITIES = [
  { icon: Waves, title: 'Infinity Pool', desc: 'Rooftop pool with breathtaking ocean views' },
  { icon: Dumbbell, title: 'Fitness Center', desc: 'State-of-the-art equipment, open 24/7' },
  { icon: UtensilsCrossed, title: 'Fine Dining', desc: 'Award-winning restaurant and bar' },
  { icon: Sparkles, title: 'Luxury Spa', desc: 'Rejuvenating treatments and wellness programs' },
  { icon: Car, title: 'Valet Parking', desc: 'Complimentary valet service for all guests' },
  { icon: Wifi, title: 'High-Speed WiFi', desc: 'Free premium internet throughout the hotel' },
  { icon: ShieldCheck, title: '24/7 Security', desc: 'Round-the-clock safety and surveillance' },
  { icon: Briefcase, title: 'Business Center', desc: 'Fully equipped meeting and conference rooms' },
];

/* ================================================================== */
/*  Contact                                                            */
/* ================================================================== */

export const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Address',
    lines: ['123 Ocean Boulevard', 'Coastal City, CA 90210'],
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+63 917 123 4567', '+63 928 987 6543'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['reservations@grandhorizon.com', 'info@grandhorizon.com'],
  },
  {
    icon: Clock,
    title: 'Front Desk',
    lines: ['Open 24 hours', '7 days a week'],
  },
];

/* ================================================================== */
/*  Hero Trust Badges                                                  */
/* ================================================================== */

export const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Free Cancellation' },
  { icon: Star, label: 'Best Price Guarantee' },
  { icon: CalendarCheck, label: 'Instant Confirmation' },
  { icon: CreditCard, label: 'Secure Payment' },
];

/* ================================================================== */
/*  About Section                                                      */
/* ================================================================== */

export const ABOUT_STATS = [
  { icon: Award, label: 'Years of Excellence', value: '25+' },
  { icon: Users, label: 'Happy Guests', value: '50K+' },
  { icon: Clock, label: '24/7 Service', value: 'Always' },
  { icon: Gem, label: 'Luxury Rooms', value: '120' },
];

export const ABOUT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury hotel room with ocean view',
  },
  {
    src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    alt: 'Grand hotel lobby and entrance',
  },
  {
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Resort pool area at sunset',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    alt: 'Beachfront hotel exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
    alt: 'Hotel spa and relaxation area',
  },
];
