# Grand Horizon Hotel & Resort

A modern, full-featured hotel landing page and reservation management system built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. The landing page is fully CMS-driven: site name, logo, theme colors, and all section content are configurable from the admin panel with no code changes.

## Features

### Client Side
- **Landing Page** — Hero, About, Rooms, Dining, Availability, Amenities, and Contact sections (all content editable via admin)
- **Room Booking** — Interactive calendar with date range selection, room type picker, guest limits per room, and Philippine Peso pricing
- **Dining Reservations** — Table reservation modal with custom calendar date picker, restaurant selection, and time slots
- **Availability Calendar** — Browse reservation calendar with color-coded room type indicators; click any date to see real-time room availability
- **Dark / Light Theme** — Persistent theme toggle stored in `localStorage`; dark mode uses configurable presets (Default, Auto, Midnight, Slate, Warm, Forest, Navy) with a darker gold default
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop

### Admin Panel (`/admin`)
- **Authentication** — Login system with session management and multi-account support
- **Site Settings** — Site name, logo, favicon, footer text; **Theme colors** (primary, secondary, accent, background) with pickers and reset to default; **Dark theme** preset selector so dark mode updates for both public site and admin
- **CMS Sections** — Hero, About, Navigation, Room Types, Rooms, Restaurants, Signature Dishes, Dining Highlights, Amenities, Availability content, Contact, Section Headers — each with CRUD or singleton edit and optional preview
- **Room Reservations** — Calendar and list views with filtering by room type, status, search, and sorting options
- **Dining Reservations** — Calendar and list views with restaurant filtering, search, and date-based stats
- **Room Types** — Create, edit, delete room type categories (name, capacity, color)
- **Room Management** — Full CRUD for individual rooms (details, pricing, bed configuration, amenities, inclusions, image gallery)
- **Room Availability** — Real-time availability dashboard
- **Admin Accounts** — Add/remove admin accounts with validation

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.3 | App Router, SSR, file-based routing |
| [React](https://react.dev/) | 19.2 | UI components, hooks, Context API |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Utility-first styling |
| [Lucide React](https://lucide.dev/) | 0.563 | Icon library |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel
│   │   ├── _components/          # AdminSidebar
│   │   ├── _config/              # tabs, previews
│   │   ├── components/           # Tab components, shared, ImageUploader, IconPicker, PreviewModal
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                      # REST API (db.json)
│   │   ├── admin/, availability-content/, cms-amenities/, contact/,
│   │   ├── dining-reservations/, dining-highlights/, hero/, landing-content/,
│   │   ├── navigation/, reservations/, restaurants/, rooms/, room-types/,
│   │   ├── section-headers/, signature-dishes/, site-settings/, upload/
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/                  # Navbar, Footer, PublicLayout, AdminLayout, ClientLayout
│   └── ui/                      # BookingModal, DiningReservationModal, Calendar
│       └── calendar/            # AdminCalendar, CustomerCalendar, BookingPickerCalendar, etc.
├── features/                    # Landing sections (Hero, About, Rooms, Dining, etc.)
├── hooks/                       # Contexts + useThemeColors, useAdminAuth (LandingContent,
│                                # Reservation, DiningReservation, RoomType, Room, Theme)
├── lib/                         # db.ts, api-helpers.ts, constants.ts (defaults, dark presets)
├── providers/hooks/             # useCrudResource, useTemplateResolver (shared logic)
├── styles/                      # globals.css (theme-aware scrollbar, etc.)
├── types/                       # Domain types (cms, rooms, reservations, admin)
└── utils/                       # colors, dates, icons, room-features, template
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hotel-next

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the client site.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Usage

### Client Site

Navigate to `http://localhost:3000` to access the landing page. Use the **"Reserve Your Stay"** button to book a room or **"Reserve a Table"** to make a dining reservation.

### Admin Panel

Navigate to `http://localhost:3000/admin` to access the admin panel.

**Default credentials:**
- Username: `admin`
- Password: `admin`

From the admin sidebar you can:
- Configure **Site Settings** (name, logo, favicon, footer; theme colors; dark theme preset)
- Edit all **CMS sections** (Hero, About, Navigation, Rooms, Dining, Amenities, Availability, Contact, Section Headers) with preview
- Switch between **Room** and **Dining** reservation management
- Toggle **Calendar** and **List** views
- Manage **Room Types** and **Rooms**, and **Admin Accounts** in Settings

## Room Configuration

| Room Type | Max Adults | Max Children | Price/Night |
|---|---|---|---|
| Deluxe Room | 2 | 2 | ₱8,500 |
| Executive Suite | 3 | 3 | ₱15,000 |
| Presidential Suite | 4 | 4 | ₱35,000 |

Room types, pricing, and availability are fully configurable from the admin panel.

## Data Storage

This project uses a **file-based JSON database** (`db.json`) accessed through the API routes. Site settings (including theme colors and dark theme preset) are stored in `siteSettings`.

| Data | Storage | Key / Path |
|---|---|---|
| Site settings (name, logo, theme, dark preset) | `db.json` | `siteSettings` |
| CMS content (hero, about, navigation, etc.) | `db.json` | `heroContent`, `aboutContent`, `navigation`, … |
| Room reservations | `db.json` | `reservations` |
| Dining reservations | `db.json` | `diningReservations` |
| Rooms & room types | `db.json` | `rooms`, `roomTypes` |
| Admin accounts | `db.json` | `adminAccounts` |
| Admin session | `sessionStorage` | `hotel-admin-auth` |
| Theme preference (light/dark) | `localStorage` | `hotel-theme` |

> No external database is required. The API reads and writes `db.json` on disk. Session and theme preference are stored in the browser.

## License

This project is private and not licensed for redistribution.
