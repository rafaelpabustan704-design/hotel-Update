'use client';

import { useState, useMemo } from 'react';
import {
  Trash2, Search, CalendarDays, Users, Mail, Phone,
  ChevronDown, ChevronUp, Filter, ArrowUpDown,
  UtensilsCrossed, Clock, X, CalendarRange, LayoutList,
} from 'lucide-react';
import type { DiningReservation } from '@/utils/types';
import { RESTAURANT_NAMES } from '@/constants/hotel';
import { AdminDiningCalendar } from '@/components/ui/Calendar';
import { cardCls, inputCls, selectCls, smallLabelCls, getTodayStr, formatDate, formatTime } from './shared';
import ConfirmModal from './ConfirmModal';

type ViewMode = 'calendar' | 'list';
type DiningStatusFilter = 'all' | 'upcoming' | 'today' | 'past';
type DiningSortBy = 'newest' | 'oldest' | 'date-asc' | 'date-desc' | 'name-asc' | 'guests-desc';

const restaurantFilterOptions = ['All Restaurants', ...RESTAURANT_NAMES];

interface DiningReservationsTabProps {
  diningReservations: DiningReservation[];
  deleteDiningReservation: (id: string) => void;
}

export default function DiningReservationsTab({ diningReservations, deleteDiningReservation }: DiningReservationsTabProps) {
  const todayStr = getTodayStr();

  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [diningSearch, setDiningSearch] = useState('');
  const [diningExpandedId, setDiningExpandedId] = useState<string | null>(null);
  const [diningSelectedDate, setDiningSelectedDate] = useState<string | null>(null);
  const [diningSelectedDateReservations, setDiningSelectedDateReservations] = useState<DiningReservation[]>([]);
  const [restaurantFilter, setRestaurantFilter] = useState('All Restaurants');
  const [diningStatusFilter, setDiningStatusFilter] = useState<DiningStatusFilter>('all');
  const [diningSortBy, setDiningSortBy] = useState<DiningSortBy>('newest');
  const [showDiningFilters, setShowDiningFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DiningReservation | null>(null);

  const hasActiveDiningFilters = restaurantFilter !== 'All Restaurants' || diningStatusFilter !== 'all' || diningSortBy !== 'newest';
  const clearDiningFilters = () => { setRestaurantFilter('All Restaurants'); setDiningStatusFilter('all'); setDiningSortBy('newest'); setDiningSearch(''); };

  const filteredDining = useMemo(() => {
    let result = [...diningReservations];
    if (diningSearch) {
      const q = diningSearch.toLowerCase();
      result = result.filter((r) => r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q) || r.restaurant.toLowerCase().includes(q));
    }
    if (restaurantFilter !== 'All Restaurants') result = result.filter((r) => r.restaurant === restaurantFilter);
    if (diningStatusFilter !== 'all') {
      result = result.filter((r) => {
        if (diningStatusFilter === 'upcoming') return r.date > todayStr;
        if (diningStatusFilter === 'today') return r.date === todayStr;
        if (diningStatusFilter === 'past') return r.date < todayStr;
        return true;
      });
    }
    result.sort((a, b) => {
      switch (diningSortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-asc': return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
        case 'date-desc': return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
        case 'name-asc': return a.fullName.localeCompare(b.fullName);
        case 'guests-desc': return (b.adults + b.children) - (a.adults + a.children);
        default: return 0;
      }
    });
    return result;
  }, [diningReservations, diningSearch, restaurantFilter, diningStatusFilter, diningSortBy, todayStr]);

  const getDiningStatusBadge = (date: string) => {
    if (date > todayStr) return <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">Upcoming</span>;
    if (date === todayStr) return <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-300">Today</span>;
    return <span className="inline-flex items-center rounded-full bg-hotel-100 dark:bg-hotel-800 px-2 py-0.5 text-[10px] font-semibold text-hotel-500 dark:text-hotel-400">Past</span>;
  };

  return (
    <>
      {/* View toggle */}
      <div className="flex items-center justify-end mb-4">
        <div className="inline-flex rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card p-1 shadow-sm">
          <button onClick={() => setViewMode('calendar')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'calendar' ? 'bg-gold-600 text-white shadow-sm' : 'text-hotel-500 dark:text-hotel-400 hover:text-hotel-700 dark:hover:text-hotel-200'}`}>
            <CalendarRange className="h-3.5 w-3.5" />Calendar
          </button>
          <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-gold-600 text-white shadow-sm' : 'text-hotel-500 dark:text-hotel-400 hover:text-hotel-700 dark:hover:text-hotel-200'}`}>
            <LayoutList className="h-3.5 w-3.5" />List
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <div className={`${cardCls} px-4 py-3`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"><UtensilsCrossed className="h-4 w-4" /></div><div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{diningSelectedDate ? diningSelectedDateReservations.length : diningReservations.filter((r) => r.date === todayStr).length}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">{diningSelectedDate ? `Reservations on ${new Date(diningSelectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Today's Reservations"}</p></div></div></div>
        <div className={`${cardCls} px-4 py-3`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><Users className="h-4 w-4" /></div><div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{diningSelectedDate ? diningSelectedDateReservations.reduce((sum, r) => sum + r.adults + r.children, 0) : diningReservations.filter((r) => r.date === todayStr).reduce((sum, r) => sum + r.adults + r.children, 0)}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">{diningSelectedDate ? `Guests on ${new Date(diningSelectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : "Today's Dining Guests"}</p></div></div></div>
        <div className={`${cardCls} px-4 py-3`}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{diningReservations.filter((r) => r.date >= todayStr).length}</p><p className="text-xs text-hotel-500 dark:text-hotel-400">Upcoming Reservations</p></div></div></div>
      </div>

      {viewMode === 'calendar' && <AdminDiningCalendar diningReservations={diningReservations} onDeleteReservation={deleteDiningReservation} onDateSelect={(date, res) => { setDiningSelectedDate(date); setDiningSelectedDateReservations(res); }} />}

      {viewMode === 'list' && <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hotel-400" />
              <input type="text" placeholder="Search by name, email, phone, or restaurant..." value={diningSearch} onChange={(e) => setDiningSearch(e.target.value)} className={`${inputCls} pl-12`} />
              {diningSearch && <button onClick={() => setDiningSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-hotel-400 hover:bg-hotel-100 hover:text-hotel-600 transition-colors"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <button onClick={() => setShowDiningFilters(!showDiningFilters)} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all ${showDiningFilters || hasActiveDiningFilters ? 'border-gold-400 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400' : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card text-hotel-600 dark:text-hotel-300 hover:border-hotel-300'}`}>
              <Filter className="h-4 w-4" />Filters{hasActiveDiningFilters && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">{(restaurantFilter !== 'All Restaurants' ? 1 : 0) + (diningStatusFilter !== 'all' ? 1 : 0) + (diningSortBy !== 'newest' ? 1 : 0)}</span>}
            </button>
          </div>

          {showDiningFilters && (
            <div className={`mb-6 rounded-xl ${cardCls} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white flex items-center gap-2"><Filter className="h-4 w-4 text-hotel-400" />Filter & Sort</h4>
                {hasActiveDiningFilters && <button onClick={clearDiningFilters} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"><X className="h-3 w-3" />Clear all</button>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={smallLabelCls}><UtensilsCrossed className="h-3.5 w-3.5" />Restaurant</label><select value={restaurantFilter} onChange={(e) => setRestaurantFilter(e.target.value)} className={selectCls}>{restaurantFilterOptions.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className={smallLabelCls}><CalendarDays className="h-3.5 w-3.5" />Status</label><select value={diningStatusFilter} onChange={(e) => setDiningStatusFilter(e.target.value as DiningStatusFilter)} className={selectCls}><option value="all">All Statuses</option><option value="upcoming">Upcoming</option><option value="today">Today</option><option value="past">Past</option></select></div>
                <div><label className={smallLabelCls}><ArrowUpDown className="h-3.5 w-3.5" />Sort By</label><select value={diningSortBy} onChange={(e) => setDiningSortBy(e.target.value as DiningSortBy)} className={selectCls}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="date-asc">Date (Earliest)</option><option value="date-desc">Date (Latest)</option><option value="name-asc">Name (A-Z)</option><option value="guests-desc">Guests (Most)</option></select></div>
              </div>
            </div>
          )}

          {(diningSearch || hasActiveDiningFilters) && filteredDining.length > 0 && <p className="mb-4 text-sm text-hotel-500 dark:text-hotel-400">Showing <span className="font-semibold text-hotel-700 dark:text-hotel-200">{filteredDining.length}</span> of <span className="font-semibold text-hotel-700 dark:text-hotel-200">{diningReservations.length}</span> reservations</p>}

          {filteredDining.length === 0 ? (
            <div className={`${cardCls} p-16 text-center`}><UtensilsCrossed className="mx-auto h-16 w-16 text-hotel-200 dark:text-hotel-600 mb-4" /><h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-2">{diningReservations.length === 0 ? 'No Table Reservations Yet' : 'No Results Found'}</h3><p className="text-hotel-500 dark:text-hotel-400 mb-4">{diningReservations.length === 0 ? 'Table reservations from the dining form will appear here.' : 'Try adjusting your search or filters.'}</p>{(diningSearch || hasActiveDiningFilters) && diningReservations.length > 0 && <button onClick={clearDiningFilters} className="rounded-lg bg-hotel-100 dark:bg-hotel-800 px-4 py-2 text-sm font-medium text-hotel-700 dark:text-hotel-300 transition-colors hover:bg-hotel-200 dark:hover:bg-hotel-700">Clear All Filters</button>}</div>
          ) : (
            <div className="space-y-4">
              {filteredDining.map((res) => {
                const isExpanded = diningExpandedId === res.id;
                return (
                  <div key={res.id} className={`${cardCls} overflow-hidden transition-shadow hover:shadow-md`}>
                    <div className="flex items-center p-5 cursor-pointer" onClick={() => setDiningExpandedId(isExpanded ? null : res.id)}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold text-sm">{res.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                        <div className="min-w-0"><div className="flex items-center gap-2"><h4 className="font-semibold text-hotel-900 dark:text-white truncate">{res.fullName}</h4>{getDiningStatusBadge(res.date)}</div><p className="text-sm text-hotel-500 dark:text-hotel-400 truncate">{res.email}</p></div>
                      </div>
                      <div className="ml-auto flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm text-hotel-600 dark:text-hotel-300">
                          <div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-hotel-400" />{res.restaurant}</div>
                          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-hotel-400" />{formatDate(res.date)}</div>
                          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-hotel-400" />{formatTime(res.time)}</div>
                          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-hotel-400" />{res.adults + res.children}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(res); }} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-hotel-400" /> : <ChevronDown className="h-5 w-5 text-hotel-400" />}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 px-5 py-5">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Email</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{res.email}</p></div></div>
                          <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Phone</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{res.phone}</p></div></div>
                          <div className="flex items-start gap-3"><CalendarDays className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Date & Time</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{formatDate(res.date)} at {formatTime(res.time)}</p></div></div>
                          <div className="flex items-start gap-3"><Users className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Restaurant & Guests</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{res.restaurant} &middot; {res.adults} {res.adults === 1 ? 'adult' : 'adults'}{res.children > 0 && <>, {res.children} {res.children === 1 ? 'child' : 'children'}</>}</p></div></div>
                        </div>
                        {res.specialRequests && <div className={`mt-4 rounded-xl p-4 ${cardCls}`}><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider mb-1">Special Requests</p><p className="text-sm text-hotel-700 dark:text-hotel-300">{res.specialRequests}</p></div>}
                        <p className="mt-4 text-xs text-hotel-400">Booked on {new Date(res.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </div>}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Dining Reservation"
          message={`Are you sure you want to delete the reservation for "${deleteTarget.fullName}"? This action cannot be undone.`}
          onConfirm={() => { deleteDiningReservation(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
