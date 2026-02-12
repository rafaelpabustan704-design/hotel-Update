# Grand Horizon Hotel & Resort

A modern, full-featured hotel landing page and reservation management system built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

## Features

### Client Side
- **Landing Page** — Hero, About, Rooms, Dining, Availability, Amenities, and Contact sections
- **Room Booking** — Interactive calendar with date range selection, room type picker, guest limits per room, and Philippine Peso pricing
- **Dining Reservations** — Table reservation modal with custom calendar date picker, restaurant selection, and time slots
- **Availability Calendar** — Browse reservation calendar with color-coded room type indicators; click any date to see real-time room availability
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop

### Admin Panel (`/admin`)
- **Authentication** — Mock login system with session management and multi-account support
- **Room Reservations** — Calendar and list views with filtering by room type, status, and sorting options
- **Dining Reservations** — Calendar and list views with restaurant filtering and date-based stats
- **Room Availability** — Real-time availability dashboard that updates when selecting dates on the calendar
- **Admin Settings** — Add/remove admin accounts with validation

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
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Client landing page
├── components/             # Reusable UI components
│   ├── layout/             # Layout components (Navbar, Footer, ClientLayout)
│   └── ui/                 # Base UI components (BookingModal, Calendar, DiningReservationModal)
├── features/               # Feature/section components
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Rooms.tsx
│   ├── Dining.tsx
│   ├── Availability.tsx
│   ├── Amenities.tsx
│   └── Contact.tsx
├── hooks/                  # Custom hooks & context providers
│   ├── ReservationContext.tsx
│   ├── DiningReservationContext.tsx
│   └── useAdminAuth.ts
├── constants/              # Static data & configuration
│   └── hotel.ts
├── styles/                 # CSS & theming
│   └── globals.css
└── utils/                  # Utility types
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
- Manage admin accounts in **Settings**

## Room Configuration

| Room Type | Max Adults | Max Children | Price/Night |
|---|---|---|---|
| Deluxe Room | 2 | 2 | ₱8,500 |
| Executive Suite | 3 | 3 | ₱15,000 |
| Presidential Suite | 4 | 4 | ₱35,000 |

## Data Storage

This project uses **client-side storage** for demonstration purposes:

- **Reservations** — `localStorage` (`hotel-reservations`, `hotel-dining-reservations`)
- **Admin session** — `sessionStorage` (`hotel-admin-auth`)
- **Admin accounts** — `localStorage` (`hotel-admin-accounts`)

> No backend or database is required. All data persists in the browser.

## License

This project is private and not licensed for redistribution.
