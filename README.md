# Grand Horizon Hotel & Resort

A modern, full-featured hotel landing page and reservation management system built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

## Features

### Client Side
- **Landing Page** — Hero, About, Rooms, Dining, Availability, Amenities, and Contact sections
- **Room Booking** — Interactive calendar with date range selection, room type picker, guest limits per room, and Philippine Peso pricing
- **Dining Reservations** — Table reservation modal with custom calendar date picker, restaurant selection, and time slots
- **Availability Calendar** — Browse reservation calendar with color-coded room type indicators; click any date to see real-time room availability
- **Dark / Light Theme** — Persistent theme toggle stored in `localStorage`
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop

### Admin Panel (`/admin`)
- **Authentication** — Login system with session management and multi-account support
- **Room Reservations** — Calendar and list views with filtering by room type, status, search, and sorting options
- **Dining Reservations** — Calendar and list views with restaurant filtering, search, and date-based stats
- **Room Types** — Create, edit, and delete room type categories (name, capacity, color)
- **Room Management** — Full CRUD for individual rooms — details, pricing, bed configuration, amenities, inclusions, and image gallery
- **Room Availability** — Real-time availability dashboard that updates when selecting dates on the calendar
- **Hotel Settings** — Editable hotel name and address
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
│   ├── admin/                    # Admin panel page
│   │   └── components/           # Admin UI components
│   │       ├── shared.ts         # Shared styles & helpers
│   │       ├── AdminLogin.tsx    # Login form
│   │       ├── ConfirmModal.tsx  # Reusable confirmation dialog
│   │       ├── RoomTypesTab.tsx  # Room type CRUD
│   │       ├── ManageRoomsTab.tsx# Individual room CRUD
│   │       ├── RoomReservationsTab.tsx
│   │       ├── DiningReservationsTab.tsx
│   │       └── SettingsTab.tsx   # Hotel settings & admin accounts
│   ├── api/                      # Backend API routes
│   │   ├── rooms/                # GET, POST, PATCH, DELETE
│   │   ├── room-types/           # GET, POST, PATCH, DELETE
│   │   ├── reservations/         # GET, POST, DELETE
│   │   ├── dining-reservations/  # GET, POST, DELETE
│   │   ├── settings/             # GET, PUT
│   │   └── admin/                # Login, account management
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Client landing page
├── components/                   # Reusable UI components
│   ├── layout/                   # Navbar, Footer, ClientLayout
│   └── ui/                       # BookingModal, DiningReservationModal
│       └── calendar/             # Calendar components
│           ├── AdminCalendar.tsx
│           ├── AdminDiningCalendar.tsx
│           ├── BookingPickerCalendar.tsx
│           ├── DiningPickerCalendar.tsx
│           ├── CustomerCalendar.tsx
│           └── helpers.ts
├── features/                     # Landing page sections
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Rooms.tsx
│   ├── Dining.tsx
│   ├── Availability.tsx
│   ├── Amenities.tsx
│   └── Contact.tsx
├── hooks/                        # Custom hooks & context providers
│   ├── ReservationContext.tsx     # Room reservations
│   ├── DiningReservationContext.tsx # Dining reservations
│   ├── RoomContext.tsx            # Managed rooms
│   ├── RoomTypeContext.tsx        # Room types & colors
│   ├── HotelSettingsContext.tsx   # Hotel name & address
│   ├── ThemeContext.tsx           # Dark/light theme
│   └── useAdminAuth.ts           # Admin authentication
├── lib/                          # Server utilities
│   └── db.ts                     # Read/write db.json
├── constants/                    # Static data & configuration
│   └── hotel.ts
├── styles/                       # CSS & theming
│   └── globals.css
└── utils/                        # Utility types
    └── types.ts
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
- Switch between **Room** and **Dining** reservation management
- Toggle between **Calendar** and **List** views
- Click dates on the calendar to view availability and stats for that day
- Manage **Room Types** (name, capacity, color coding)
- Manage **Rooms** (details, pricing, amenities, images)
- Configure **Hotel Settings** (name, address)
- Manage **Admin Accounts** in Settings

## Room Configuration

| Room Type | Max Adults | Max Children | Price/Night |
|---|---|---|---|
| Deluxe Room | 2 | 2 | ₱8,500 |
| Executive Suite | 3 | 3 | ₱15,000 |
| Presidential Suite | 4 | 4 | ₱35,000 |

Room types, pricing, and availability are fully configurable from the admin panel.

## Data Storage

This project uses a **file-based JSON database** (`db.json`) accessed through the API routes:

| Data | Storage | Key / Path |
|---|---|---|
| Room reservations | `db.json` | `reservations` |
| Dining reservations | `db.json` | `diningReservations` |
| Rooms | `db.json` | `rooms` |
| Room types | `db.json` | `roomTypes` |
| Hotel settings | `db.json` | `settings` |
| Admin accounts | `db.json` | `adminAccounts` |
| Admin session | `sessionStorage` | `hotel-admin-auth` |
| Theme preference | `localStorage` | `hotel-theme` |

> No external database is required. The API routes read and write to `db.json` on disk. Session and theme preferences are stored in the browser.

## License

This project is private and not licensed for redistribution.
