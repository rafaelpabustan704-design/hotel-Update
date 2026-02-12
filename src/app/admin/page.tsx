'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Trash2,
  Search,
  CalendarDays,
  Users,
  BedDouble,
  Mail,
  Phone,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  LayoutList,
  CalendarRange,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Clock,
  X,
  Hotel,
  LogOut,
  Lock,
  User,
  Menu,
  ChevronLeft as PanelClose,
  Settings,
  UserPlus,
  Shield,
} from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { useDiningReservations } from '@/hooks/DiningReservationContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminCalendar, AdminDiningCalendar } from '@/components/ui/Calendar';
import { ROOM_TYPES, ROOM_INVENTORY, RESTAURANT_NAMES } from '@/constants/hotel';

type AdminTab = 'rooms' | 'dining' | 'settings';
type ViewMode = 'list' | 'calendar';
type StatusFilter = 'all' | 'upcoming' | 'current' | 'past';
type DiningStatusFilter = 'all' | 'upcoming' | 'today' | 'past';
type SortBy = 'newest' | 'oldest' | 'checkIn-asc' | 'checkIn-desc' | 'name-asc' | 'guests-desc';
type DiningSortBy = 'newest' | 'oldest' | 'date-asc' | 'date-desc' | 'name-asc' | 'guests-desc';

const roomFilterOptions = ['All Rooms', ...ROOM_TYPES];
const restaurantFilterOptions = ['All Restaurants', ...RESTAURANT_NAMES];
const _now = new Date();
const todayStr = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

function formatDateLabel(dateStr: string): string {
  if (dateStr === todayStr) return "Today\u2019s";
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AdminPage() {
  const { reservations, deleteReservation } = useReservations();
  const { diningReservations, deleteDiningReservation } = useDiningReservations();
  const [adminTab, setAdminTab] = useState<AdminTab>('rooms');
  const [search, setSearch] = useState('');
  const [diningSearch, setDiningSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [diningExpandedId, setDiningExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Room calendar selected date
  const [roomSelectedDate, setRoomSelectedDate] = useState<string | null>(null);

  // Dining calendar selected date
  const [diningSelectedDate, setDiningSelectedDate] = useState<string | null>(null);
  const [diningSelectedDateReservations, setDiningSelectedDateReservations] = useState<typeof diningReservations>([]);

  // Room Filters
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Dining Filters
  const [restaurantFilter, setRestaurantFilter] = useState('All Restaurants');
  const [diningStatusFilter, setDiningStatusFilter] = useState<DiningStatusFilter>('all');
  const [diningSortBy, setDiningSortBy] = useState<DiningSortBy>('newest');
  const [showDiningFilters, setShowDiningFilters] = useState(false);

  const hasActiveFilters = roomFilter !== 'All Rooms' || statusFilter !== 'all' || sortBy !== 'newest';
  const hasActiveDiningFilters = restaurantFilter !== 'All Restaurants' || diningStatusFilter !== 'all' || diningSortBy !== 'newest';

  /* The date used for stats & availability — calendar selection or today */
  const activeDate = roomSelectedDate || todayStr;

  /* Real-time room availability for selected date */
  const availability = useMemo(() => {
    return ROOM_INVENTORY.map((room) => {
      const booked = reservations.filter(
        (r) => r.roomType === room.name && r.checkIn <= activeDate && r.checkOut >= activeDate
      ).length;
      const available = Math.max(0, room.total - booked);
      return { ...room, booked, available };
    });
  }, [reservations, activeDate]);

  const totalRooms = ROOM_INVENTORY.reduce((sum, r) => sum + r.total, 0);
  const totalAvailable = availability.reduce((sum, r) => sum + r.available, 0);
  const totalBooked = totalRooms - totalAvailable;

  const clearFilters = () => {
    setRoomFilter('All Rooms');
    setStatusFilter('all');
    setSortBy('newest');
    setSearch('');
  };

  const clearDiningFilters = () => {
    setRestaurantFilter('All Restaurants');
    setDiningStatusFilter('all');
    setDiningSortBy('newest');
    setDiningSearch('');
  };

  const filtered = useMemo(() => {
    let result = [...reservations];

    // Text search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.roomType.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q),
      );
    }

    // Room type
    if (roomFilter !== 'All Rooms') {
      result = result.filter((r) => r.roomType === roomFilter);
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter((r) => {
        if (statusFilter === 'upcoming') return r.checkIn > todayStr;
        if (statusFilter === 'current') return r.checkIn <= todayStr && r.checkOut > todayStr;
        if (statusFilter === 'past') return r.checkOut <= todayStr;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'checkIn-asc':
          return a.checkIn.localeCompare(b.checkIn);
        case 'checkIn-desc':
          return b.checkIn.localeCompare(a.checkIn);
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'guests-desc':
          return (b.adults + b.children) - (a.adults + a.children);
        default:
          return 0;
      }
    });

    return result;
  }, [reservations, search, roomFilter, statusFilter, sortBy]);

  const filteredDining = useMemo(() => {
    let result = [...diningReservations];

    // Text search
    if (diningSearch) {
      const q = diningSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.restaurant.toLowerCase().includes(q),
      );
    }

    // Restaurant
    if (restaurantFilter !== 'All Restaurants') {
      result = result.filter((r) => r.restaurant === restaurantFilter);
    }

    // Status
    if (diningStatusFilter !== 'all') {
      result = result.filter((r) => {
        if (diningStatusFilter === 'upcoming') return r.date > todayStr;
        if (diningStatusFilter === 'today') return r.date === todayStr;
        if (diningStatusFilter === 'past') return r.date < todayStr;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (diningSortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-asc':
          return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
        case 'date-desc':
          return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'guests-desc':
          return (b.adults + b.children) - (a.adults + a.children);
        default:
          return 0;
      }
    });

    return result;
  }, [diningReservations, diningSearch, restaurantFilter, diningStatusFilter, diningSortBy]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDiningStatusBadge = (date: string) => {
    if (date > todayStr)
      return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Upcoming</span>;
    if (date === todayStr)
      return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">Today</span>;
    return <span className="inline-flex items-center rounded-full bg-hotel-100 px-2 py-0.5 text-[10px] font-semibold text-hotel-500">Past</span>;
  };

  const getStatusBadge = (checkIn: string, checkOut: string) => {
    if (checkIn > todayStr)
      return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Upcoming</span>;
    if (checkIn <= todayStr && checkOut > todayStr)
      return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">Current</span>;
    return <span className="inline-flex items-center rounded-full bg-hotel-100 px-2 py-0.5 text-[10px] font-semibold text-hotel-500">Past</span>;
  };

  // Current active view for header toggle
  const currentView = viewMode;
  const setCurrentView = (v: ViewMode) => setViewMode(v);

  const { isAuthenticated, isLoading, currentUser, accounts, login, logout, addAccount, deleteAccount } = useAdminAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ username: '', password: '' });
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');

  // Clear login form when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setLoginForm({ username: '', password: '' });
      setLoginError('');
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginForm.username, loginForm.password);
    if (!success) {
      setLoginError('Invalid username or password');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-hotel-50 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Hotel className="h-8 w-8 text-gold-600" />
          <span className="font-serif text-xl font-bold text-hotel-900">Loading...</span>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hotel-900 via-hotel-800 to-hotel-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gold-600/20 mb-4">
              <Hotel className="h-8 w-8 text-gold-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Grand Horizon</h1>
            <p className="text-hotel-400 text-sm">Admin Panel</p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl bg-white shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-hotel-100 mb-3">
                <Lock className="h-5 w-5 text-hotel-600" />
              </div>
              <h2 className="font-serif text-xl font-bold text-hotel-900">Welcome Back</h2>
              <p className="text-sm text-hotel-500 mt-1">Sign in to manage reservations</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700">
                  <User className="h-4 w-4 text-hotel-400" />
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                  className="w-full rounded-xl border border-hotel-200 bg-white px-4 py-3 text-sm text-hotel-900 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700">
                  <Lock className="h-4 w-4 text-hotel-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-hotel-200 bg-white px-4 py-3 text-sm text-hotel-900 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gold-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ===== Authenticated admin panel =====
  return (
    <div className="min-h-screen bg-hotel-50 flex">
      {/* ===== Mobile sidebar overlay ===== */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ===== Left Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-hotel-900 flex flex-col shrink-0 transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:z-auto ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <Hotel className="h-7 w-7 text-gold-400 shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="font-serif text-lg font-bold text-white whitespace-nowrap">Grand Horizon</span>
              <p className="text-[10px] text-hotel-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          )}
          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex ml-auto h-7 w-7 items-center justify-center rounded-lg text-hotel-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <PanelClose className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          {/* Close button (mobile) */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden ml-auto h-7 w-7 flex items-center justify-center rounded-lg text-hotel-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>
            {sidebarOpen ? 'Reservations' : ''}
          </p>

          {/* Rooms */}
          <button
            onClick={() => { setAdminTab('rooms'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              adminTab === 'rooms'
                ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25'
                : 'text-hotel-400 hover:text-white hover:bg-white/10'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <BedDouble className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Room Reservations</span>}
            {sidebarOpen && (
              <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                adminTab === 'rooms' ? 'bg-white/20 text-white' : 'bg-white/10 text-hotel-400'
              }`}>
                {reservations.length}
              </span>
            )}
          </button>

          {/* Dining */}
          <button
            onClick={() => { setAdminTab('dining'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              adminTab === 'dining'
                ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25'
                : 'text-hotel-400 hover:text-white hover:bg-white/10'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <UtensilsCrossed className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Dining Reservations</span>}
            {sidebarOpen && (
              <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                adminTab === 'dining' ? 'bg-white/20 text-white' : 'bg-white/10 text-hotel-400'
              }`}>
                {diningReservations.length}
              </span>
            )}
          </button>

          {/* Separator */}
          <div className="h-px bg-white/10 my-3" />

          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>
            {sidebarOpen ? 'View Mode' : ''}
          </p>

          {/* Calendar view */}
          <button
            onClick={() => setCurrentView('calendar')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              currentView === 'calendar'
                ? 'bg-white/15 text-white'
                : 'text-hotel-400 hover:text-white hover:bg-white/10'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <CalendarRange className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Calendar</span>}
          </button>

          {/* List view */}
          <button
            onClick={() => setCurrentView('list')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              currentView === 'list'
                ? 'bg-white/15 text-white'
                : 'text-hotel-400 hover:text-white hover:bg-white/10'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LayoutList className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>List</span>}
          </button>

          {/* Separator */}
          <div className="h-px bg-white/10 my-3" />

          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>
            {sidebarOpen ? 'System' : ''}
          </p>

          {/* Settings */}
          <button
            onClick={() => { setAdminTab('settings'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              adminTab === 'settings'
                ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25'
                : 'text-hotel-400 hover:text-white hover:bg-white/10'
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 min-w-0">
        {/* Mobile header bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-hotel-900 px-4 h-14 shadow-md">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Hotel className="h-5 w-5 text-gold-400" />
          <span className="font-serif text-base font-bold text-white">Grand Horizon</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-hotel-900">
              {adminTab === 'rooms' ? 'Room Reservations' : adminTab === 'dining' ? 'Dining Reservations' : 'Settings'}
            </h1>
            <p className="text-hotel-500 mt-1">
              {adminTab === 'rooms'
                ? 'View and manage all room reservations'
                : adminTab === 'dining'
                ? 'View and manage all table reservations'
                : 'Manage admin accounts and system settings'}
            </p>
          </div>

        {/* ==================== ROOMS TAB ==================== */}
        {adminTab === 'rooms' && (
          <>
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hotel-900">
                  {reservations.filter((r) => r.checkIn <= activeDate && r.checkOut >= activeDate).length}
                </p>
                <p className="text-sm text-hotel-500">
                  {roomSelectedDate ? formatDateLabel(roomSelectedDate) : "Today\u2019s"} Reservations
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hotel-900">
                  {reservations.filter((r) => r.checkIn > activeDate).length}
                </p>
                <p className="text-sm text-hotel-500">Upcoming Reservations</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hotel-900">
                  {new Set(reservations.map((r) => r.roomType)).size}
                </p>
                <p className="text-sm text-hotel-500">Room Types Booked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Availability */}
        <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <BedDouble className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-hotel-900">
                  Room Availability {roomSelectedDate ? formatDateLabel(roomSelectedDate) : 'Today'}
                </h3>
                <p className="text-xs text-hotel-500">
                  <span className="font-semibold text-emerald-600">{totalAvailable}</span> available &middot;{' '}
                  <span className="font-semibold text-hotel-700">{totalBooked}</span> booked &middot;{' '}
                  {totalRooms} total
                </p>
              </div>
            </div>
            {/* Overall occupancy */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-hotel-500">Occupancy</span>
              <div className="w-32 h-2 rounded-full bg-hotel-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${totalRooms > 0 ? ((totalBooked / totalRooms) * 100) : 0}%` }}
                />
              </div>
              <span className="text-xs font-bold text-hotel-700">
                {totalRooms > 0 ? Math.round((totalBooked / totalRooms) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {availability.map((room) => {
              const pct = room.total > 0 ? (room.booked / room.total) * 100 : 0;
              return (
                <div key={room.name} className="rounded-xl border border-hotel-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${room.dot}`} />
                      <span className="text-sm font-medium text-hotel-800">{room.name}</span>
                    </div>
                    {room.available > 0 ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-600">{room.available} open</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                        <span className="text-xs font-semibold text-red-500">Full</span>
                      </div>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-hotel-100 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${room.bar} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-hotel-400">
                    <span>{room.booked} booked</span>
                    <span>{room.total} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <AdminCalendar
            reservations={reservations}
            onDeleteReservation={deleteReservation}
            onDateSelect={setRoomSelectedDate}
          />
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {/* Search + Filter toggle */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hotel-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or room type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-hotel-200 bg-white py-3.5 pl-12 pr-4 text-sm text-hotel-900 placeholder:text-hotel-400 shadow-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-hotel-400 hover:bg-hotel-100 hover:text-hotel-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all ${
                  showFilters || hasActiveFilters
                    ? 'border-gold-400 bg-gold-50 text-gold-700'
                    : 'border-hotel-200 bg-white text-hotel-600 hover:border-hotel-300'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">
                    {(roomFilter !== 'All Rooms' ? 1 : 0) +
                      (statusFilter !== 'all' ? 1 : 0) +
                      (sortBy !== 'newest' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="mb-6 rounded-xl border border-hotel-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-hotel-900 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-hotel-400" />
                    Filter & Sort
                  </h4>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Room type */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                      <BedDouble className="h-3.5 w-3.5" />
                      Room Type
                    </label>
                    <select
                      value={roomFilter}
                      onChange={(e) => setRoomFilter(e.target.value)}
                      className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                    >
                      {roomFilterOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                    >
                      <option value="all">All Statuses</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="current">Current Stay</option>
                      <option value="past">Past</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="checkIn-asc">Check-in (Earliest)</option>
                      <option value="checkIn-desc">Check-in (Latest)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="guests-desc">Guests (Most)</option>
                    </select>
                  </div>
                </div>

                {/* Active filter pills */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-hotel-100">
                    {roomFilter !== 'All Rooms' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                        {roomFilter}
                        <button onClick={() => setRoomFilter('All Rooms')} className="hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                        {statusFilter === 'upcoming' ? 'Upcoming' : statusFilter === 'current' ? 'Current Stay' : 'Past'}
                        <button onClick={() => setStatusFilter('all')} className="hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {sortBy !== 'newest' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                        Sort: {
                          sortBy === 'oldest' ? 'Oldest First' :
                          sortBy === 'checkIn-asc' ? 'Check-in Earliest' :
                          sortBy === 'checkIn-desc' ? 'Check-in Latest' :
                          sortBy === 'name-asc' ? 'Name A-Z' :
                          'Most Guests'
                        }
                        <button onClick={() => setSortBy('newest')} className="hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Result count */}
            {(search || hasActiveFilters) && filtered.length > 0 && (
              <p className="mb-4 text-sm text-hotel-500">
                Showing <span className="font-semibold text-hotel-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-hotel-700">{reservations.length}</span> reservations
              </p>
            )}

            {/* Reservations List */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl bg-white border border-hotel-100 p-16 text-center shadow-sm">
                <ClipboardList className="mx-auto h-16 w-16 text-hotel-200 mb-4" />
                <h3 className="font-serif text-xl font-bold text-hotel-900 mb-2">
                  {reservations.length === 0 ? 'No Reservations Yet' : 'No Results Found'}
                </h3>
                <p className="text-hotel-500 mb-4">
                  {reservations.length === 0
                    ? 'Reservations from the booking form will appear here.'
                    : 'Try adjusting your search or filters.'}
                </p>
                {(search || hasActiveFilters) && reservations.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="rounded-lg bg-hotel-100 px-4 py-2 text-sm font-medium text-hotel-700 transition-colors hover:bg-hotel-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((reservation) => {
                    const isExpanded = expandedId === reservation.id;
                    return (
                      <div
                        key={reservation.id}
                        className="rounded-2xl bg-white border border-hotel-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                      >
                        {/* Main row */}
                        <div
                          className="flex items-center p-5 cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : reservation.id)}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700 font-bold text-sm">
                              {reservation.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-hotel-900 truncate">
                                  {reservation.fullName}
                                </h4>
                                {getStatusBadge(reservation.checkIn, reservation.checkOut)}
                              </div>
                              <p className="text-sm text-hotel-500 truncate">{reservation.email}</p>
                            </div>
                          </div>

                          <div className="ml-auto flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-6 text-sm text-hotel-600">
                              <div className="flex items-center gap-2">
                                <BedDouble className="h-4 w-4 text-hotel-400" />
                                {reservation.roomType}
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-hotel-400" />
                                {formatDate(reservation.checkIn)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-hotel-400" />
                                {reservation.adults + reservation.children}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this reservation?')) {
                                    deleteReservation(reservation.id);
                                  }
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-hotel-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-hotel-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="border-t border-hotel-100 bg-hotel-50/50 px-5 py-5">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-0.5 text-hotel-400" />
                                <div>
                                  <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">
                                    Email
                                  </p>
                                  <p className="text-sm text-hotel-800">{reservation.email}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 mt-0.5 text-hotel-400" />
                                <div>
                                  <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">
                                    Phone
                                  </p>
                                  <p className="text-sm text-hotel-800">{reservation.phone}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CalendarDays className="h-4 w-4 mt-0.5 text-hotel-400" />
                                <div>
                                  <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">
                                    Stay Dates
                                  </p>
                                  <p className="text-sm text-hotel-800">
                                    {formatDate(reservation.checkIn)} &mdash;{' '}
                                    {formatDate(reservation.checkOut)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <BedDouble className="h-4 w-4 mt-0.5 text-hotel-400" />
                                <div>
                                  <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">
                                    Room &amp; Guests
                                  </p>
                                  <p className="text-sm text-hotel-800">
                                    {reservation.roomType} &middot; {reservation.adults}{' '}
                                    {reservation.adults === 1 ? 'adult' : 'adults'}
                                    {reservation.children > 0 && (
                                      <>, {reservation.children} {reservation.children === 1 ? 'child' : 'children'}</>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {reservation.specialRequests && (
                              <div className="mt-4 rounded-xl bg-white p-4 border border-hotel-100">
                                <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider mb-1">
                                  Special Requests
                                </p>
                                <p className="text-sm text-hotel-700">{reservation.specialRequests}</p>
                              </div>
                            )}
                            <p className="mt-4 text-xs text-hotel-400">
                              Booked on {new Date(reservation.createdAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
          </>
        )}

        {/* ==================== DINING TAB ==================== */}
        {adminTab === 'dining' && (
          <>
            {/* Dining Stats */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <UtensilsCrossed className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-hotel-900">
                      {diningSelectedDate ? diningSelectedDateReservations.length : diningReservations.filter((r) => r.date === todayStr).length}
                    </p>
                    <p className="text-sm text-hotel-500">
                      {diningSelectedDate
                        ? `Reservations on ${new Date(diningSelectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        : "Today's Reservations"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-hotel-900">
                      {diningSelectedDate
                        ? diningSelectedDateReservations.reduce((sum, r) => sum + r.adults + r.children, 0)
                        : diningReservations.filter((r) => r.date === todayStr).reduce((sum, r) => sum + r.adults + r.children, 0)}
                    </p>
                    <p className="text-sm text-hotel-500">
                      {diningSelectedDate
                        ? `Dining Guests on ${new Date(diningSelectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        : "Today's Dining Guests"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-hotel-100">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-hotel-900">
                      {diningReservations.filter((r) => r.date >= todayStr).length}
                    </p>
                    <p className="text-sm text-hotel-500">Upcoming Reservations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <AdminDiningCalendar
                diningReservations={diningReservations}
                onDeleteReservation={deleteDiningReservation}
                onDateSelect={(date, res) => {
                  setDiningSelectedDate(date);
                  setDiningSelectedDateReservations(res);
                }}
              />
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                {/* Dining search + Filter toggle */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hotel-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or restaurant..."
                      value={diningSearch}
                      onChange={(e) => setDiningSearch(e.target.value)}
                      className="w-full rounded-xl border border-hotel-200 bg-white py-3.5 pl-12 pr-4 text-sm text-hotel-900 placeholder:text-hotel-400 shadow-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                    />
                    {diningSearch && (
                      <button
                        onClick={() => setDiningSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-hotel-400 hover:bg-hotel-100 hover:text-hotel-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDiningFilters(!showDiningFilters)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all ${
                      showDiningFilters || hasActiveDiningFilters
                        ? 'border-gold-400 bg-gold-50 text-gold-700'
                        : 'border-hotel-200 bg-white text-hotel-600 hover:border-hotel-300'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveDiningFilters && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">
                        {(restaurantFilter !== 'All Restaurants' ? 1 : 0) +
                          (diningStatusFilter !== 'all' ? 1 : 0) +
                          (diningSortBy !== 'newest' ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Dining Filter panel */}
                {showDiningFilters && (
                  <div className="mb-6 rounded-xl border border-hotel-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-hotel-900 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-hotel-400" />
                        Filter & Sort
                      </h4>
                      {hasActiveDiningFilters && (
                        <button
                          onClick={clearDiningFilters}
                          className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Restaurant */}
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                          Restaurant
                        </label>
                        <select
                          value={restaurantFilter}
                          onChange={(e) => setRestaurantFilter(e.target.value)}
                          className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                        >
                          {restaurantFilterOptions.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Status
                        </label>
                        <select
                          value={diningStatusFilter}
                          onChange={(e) => setDiningStatusFilter(e.target.value as DiningStatusFilter)}
                          className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                        >
                          <option value="all">All Statuses</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="today">Today</option>
                          <option value="past">Past</option>
                        </select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500">
                          <ArrowUpDown className="h-3.5 w-3.5" />
                          Sort By
                        </label>
                        <select
                          value={diningSortBy}
                          onChange={(e) => setDiningSortBy(e.target.value as DiningSortBy)}
                          className="w-full rounded-lg border border-hotel-200 bg-white px-3 py-2 text-sm text-hotel-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="date-asc">Date (Earliest)</option>
                          <option value="date-desc">Date (Latest)</option>
                          <option value="name-asc">Name (A-Z)</option>
                          <option value="guests-desc">Guests (Most)</option>
                        </select>
                      </div>
                    </div>

                    {/* Active filter pills */}
                    {hasActiveDiningFilters && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-hotel-100">
                        {restaurantFilter !== 'All Restaurants' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                            {restaurantFilter}
                            <button onClick={() => setRestaurantFilter('All Restaurants')} className="hover:text-red-500 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                        {diningStatusFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                            {diningStatusFilter === 'upcoming' ? 'Upcoming' : diningStatusFilter === 'today' ? 'Today' : 'Past'}
                            <button onClick={() => setDiningStatusFilter('all')} className="hover:text-red-500 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                        {diningSortBy !== 'newest' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-hotel-100 px-3 py-1 text-xs font-medium text-hotel-700">
                            Sort: {
                              diningSortBy === 'oldest' ? 'Oldest First' :
                              diningSortBy === 'date-asc' ? 'Date Earliest' :
                              diningSortBy === 'date-desc' ? 'Date Latest' :
                              diningSortBy === 'name-asc' ? 'Name A-Z' :
                              'Most Guests'
                            }
                            <button onClick={() => setDiningSortBy('newest')} className="hover:text-red-500 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Result count */}
                {(diningSearch || hasActiveDiningFilters) && filteredDining.length > 0 && (
                  <p className="mb-4 text-sm text-hotel-500">
                    Showing <span className="font-semibold text-hotel-700">{filteredDining.length}</span> of{' '}
                    <span className="font-semibold text-hotel-700">{diningReservations.length}</span> reservations
                  </p>
                )}

                {/* Dining Reservations List */}
                {filteredDining.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-hotel-100 p-16 text-center shadow-sm">
                    <UtensilsCrossed className="mx-auto h-16 w-16 text-hotel-200 mb-4" />
                    <h3 className="font-serif text-xl font-bold text-hotel-900 mb-2">
                      {diningReservations.length === 0 ? 'No Table Reservations Yet' : 'No Results Found'}
                    </h3>
                    <p className="text-hotel-500 mb-4">
                      {diningReservations.length === 0
                        ? 'Table reservations from the dining form will appear here.'
                        : 'Try adjusting your search or filters.'}
                    </p>
                    {(diningSearch || hasActiveDiningFilters) && diningReservations.length > 0 && (
                      <button
                        onClick={clearDiningFilters}
                        className="rounded-lg bg-hotel-100 px-4 py-2 text-sm font-medium text-hotel-700 transition-colors hover:bg-hotel-200"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDining.map((res) => {
                      const isExpanded = diningExpandedId === res.id;
                      return (
                        <div
                          key={res.id}
                          className="rounded-2xl bg-white border border-hotel-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                        >
                          {/* Main row */}
                          <div
                            className="flex items-center p-5 cursor-pointer"
                            onClick={() => setDiningExpandedId(isExpanded ? null : res.id)}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
                                {res.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-hotel-900 truncate">
                                    {res.fullName}
                                  </h4>
                                  {getDiningStatusBadge(res.date)}
                                </div>
                                <p className="text-sm text-hotel-500 truncate">{res.email}</p>
                              </div>
                            </div>

                            <div className="ml-auto flex items-center gap-6">
                              <div className="hidden md:flex items-center gap-6 text-sm text-hotel-600">
                                <div className="flex items-center gap-2">
                                  <UtensilsCrossed className="h-4 w-4 text-hotel-400" />
                                  {res.restaurant}
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-hotel-400" />
                                  {formatDate(res.date)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-hotel-400" />
                                  {formatTime(res.time)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-hotel-400" />
                                  {res.adults + res.children}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this dining reservation?')) {
                                      deleteDiningReservation(res.id);
                                    }
                                  }}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-hotel-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-hotel-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="border-t border-hotel-100 bg-hotel-50/50 px-5 py-5">
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-start gap-3">
                                  <Mail className="h-4 w-4 mt-0.5 text-hotel-400" />
                                  <div>
                                    <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-sm text-hotel-800">{res.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Phone className="h-4 w-4 mt-0.5 text-hotel-400" />
                                  <div>
                                    <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Phone</p>
                                    <p className="text-sm text-hotel-800">{res.phone}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <CalendarDays className="h-4 w-4 mt-0.5 text-hotel-400" />
                                  <div>
                                    <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Date & Time</p>
                                    <p className="text-sm text-hotel-800">
                                      {formatDate(res.date)} at {formatTime(res.time)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Users className="h-4 w-4 mt-0.5 text-hotel-400" />
                                  <div>
                                    <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Restaurant & Guests</p>
                                    <p className="text-sm text-hotel-800">
                                      {res.restaurant} &middot; {res.adults}{' '}
                                      {res.adults === 1 ? 'adult' : 'adults'}
                                      {res.children > 0 && (
                                        <>, {res.children} {res.children === 1 ? 'child' : 'children'}</>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {res.specialRequests && (
                                <div className="mt-4 rounded-xl bg-white p-4 border border-hotel-100">
                                  <p className="text-xs text-hotel-400 font-medium uppercase tracking-wider mb-1">
                                    Special Requests
                                  </p>
                                  <p className="text-sm text-hotel-700">{res.specialRequests}</p>
                                </div>
                              )}
                              <p className="mt-4 text-xs text-hotel-400">
                                Booked on {new Date(res.createdAt).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {adminTab === 'settings' && (
          <div className="space-y-8">
            {/* Current user info */}
            <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-hotel-500">Logged in as</p>
                  <p className="text-lg font-bold text-hotel-900">{currentUser}</p>
                </div>
              </div>
            </div>

            {/* Add new admin */}
            <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-hotel-900">Add New Admin</h3>
                  <p className="text-xs text-hotel-500">Create a new admin account</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const result = addAccount(newAdminForm.username.trim(), newAdminForm.password);
                  if (result.success) {
                    setNewAdminForm({ username: '', password: '' });
                    setAdminFormError('');
                    setAdminFormSuccess('Admin account created successfully');
                    setTimeout(() => setAdminFormSuccess(''), 3000);
                  } else {
                    setAdminFormSuccess('');
                    setAdminFormError(result.error || 'Failed to create account');
                    setTimeout(() => setAdminFormError(''), 3000);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700">
                      <User className="h-4 w-4 text-hotel-400" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={newAdminForm.username}
                      onChange={(e) => setNewAdminForm((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Enter username (min 3 chars)"
                      required
                      minLength={3}
                      className="w-full rounded-xl border border-hotel-200 bg-white px-4 py-3 text-sm text-hotel-900 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700">
                      <Lock className="h-4 w-4 text-hotel-400" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Enter password (min 4 chars)"
                      required
                      minLength={4}
                      className="w-full rounded-xl border border-hotel-200 bg-white px-4 py-3 text-sm text-hotel-900 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {adminFormError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 shrink-0" />
                    {adminFormError}
                  </p>
                )}
                {adminFormSuccess && (
                  <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {adminFormSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98]"
                >
                  Add Admin
                </button>
              </form>
            </div>

            {/* Admin accounts list */}
            <div className="rounded-2xl bg-white border border-hotel-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-hotel-900">Admin Accounts</h3>
                  <p className="text-xs text-hotel-500">{accounts.length} account{accounts.length !== 1 ? 's' : ''} registered</p>
                </div>
              </div>

              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-xl border border-hotel-100 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hotel-100 text-hotel-600 font-bold text-sm">
                        {account.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-hotel-900">{account.username}</p>
                          {account.username === currentUser && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                              You
                            </span>
                          )}
                          {account.id === 'default-admin' && (
                            <span className="inline-flex items-center rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-hotel-400">
                          Created {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the account "${account.username}"?`)) {
                          const result = deleteAccount(account.id);
                          if (!result.success) {
                            setAdminFormError(result.error || 'Failed to delete account');
                            setTimeout(() => setAdminFormError(''), 3000);
                          }
                        }
                      }}
                      disabled={account.username === currentUser || accounts.length <= 1}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        account.username === currentUser || accounts.length <= 1
                          ? 'text-hotel-200 cursor-not-allowed'
                          : 'text-hotel-400 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>

          {/* Footer */}
          <div className="mt-12 border-t border-hotel-200 pt-6 pb-4 flex items-center justify-between text-xs text-hotel-400">
            <p>&copy; {new Date().getFullYear()} Grand Horizon Hotel &middot; Admin Panel</p>
            <p className="font-medium text-hotel-500">Admin Panel</p>
          </div>
      </main>
    </div>
  );
}
