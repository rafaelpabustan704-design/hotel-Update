'use client';

import { useState, useMemo } from 'react';
import {
  Trash2, Search, CalendarDays, Users, BedDouble, Mail, Phone,
  ClipboardList, ChevronDown, ChevronUp, Filter, ArrowUpDown,
  CheckCircle2, XCircle, X, CalendarRange, LayoutList,
} from 'lucide-react';
import type { Reservation, RoomType } from '@/types';
import { getColorClasses } from '@/hooks/RoomTypeContext';
import { AdminCalendar } from '@/components/ui/Calendar';
import { cardCls, inputCls, selectCls, smallLabelCls, getTodayStr, formatDate, formatDateLabel } from './shared';
import ConfirmModal from './ConfirmModal';

type ViewMode = 'calendar' | 'list';
type StatusFilter = 'all' | 'upcoming' | 'current' | 'past';
type SortBy = 'newest' | 'oldest' | 'checkIn-asc' | 'checkIn-desc' | 'name-asc' | 'guests-desc';

interface RoomReservationsTabProps {
  reservations: Reservation[];
  deleteReservation: (id: string) => void;
  roomTypes: RoomType[];
}

export default function RoomReservationsTab({ reservations, deleteReservation, roomTypes }: RoomReservationsTabProps) {
  const todayStr = getTodayStr();

  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [roomSelectedDate, setRoomSelectedDate] = useState<string | null>(null);
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);

  const roomTypeNames = useMemo(() => roomTypes.map((rt) => rt.name), [roomTypes]);
  const roomFilterOptions = useMemo(() => ['All Rooms', ...roomTypeNames], [roomTypeNames]);
  const hasActiveFilters = roomFilter !== 'All Rooms' || statusFilter !== 'all' || sortBy !== 'newest';
  const activeDate = roomSelectedDate || todayStr;

  const availability = useMemo(() => {
    return roomTypes.map((rt) => {
      const cc = getColorClasses(rt.color);
      const booked = reservations.filter(
        (r) => r.roomType === rt.name && r.checkIn <= activeDate && r.checkOut >= activeDate
      ).length;
      const available = Math.max(0, rt.totalRooms - booked);
      return { ...rt, booked, available, hex: cc.hex };
    });
  }, [roomTypes, reservations, activeDate]);

  const totalRooms = roomTypes.reduce((sum, rt) => sum + rt.totalRooms, 0);
  const totalAvailable = availability.reduce((sum, r) => sum + r.available, 0);
  const totalBooked = totalRooms - totalAvailable;

  const clearFilters = () => { setRoomFilter('All Rooms'); setStatusFilter('all'); setSortBy('newest'); setSearch(''); };

  const filtered = useMemo(() => {
    let result = [...reservations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.roomType.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q));
    }
    if (roomFilter !== 'All Rooms') result = result.filter((r) => r.roomType === roomFilter);
    if (statusFilter !== 'all') {
      result = result.filter((r) => {
        if (statusFilter === 'upcoming') return r.checkIn > todayStr;
        if (statusFilter === 'current') return r.checkIn <= todayStr && r.checkOut > todayStr;
        if (statusFilter === 'past') return r.checkOut <= todayStr;
        return true;
      });
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'checkIn-asc': return a.checkIn.localeCompare(b.checkIn);
        case 'checkIn-desc': return b.checkIn.localeCompare(a.checkIn);
        case 'name-asc': return a.fullName.localeCompare(b.fullName);
        case 'guests-desc': return (b.adults + b.children) - (a.adults + a.children);
        default: return 0;
      }
    });
    return result;
  }, [reservations, search, roomFilter, statusFilter, sortBy, todayStr]);

  const getStatusBadge = (checkIn: string, checkOut: string) => {
    if (checkIn > todayStr) return <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">Upcoming</span>;
    if (checkIn <= todayStr && checkOut > todayStr) return <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-300">Current</span>;
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
        <div className={`${cardCls} px-4 py-3`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><ClipboardList className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{reservations.filter((r) => r.checkIn <= activeDate && r.checkOut >= activeDate).length}</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{roomSelectedDate ? formatDateLabel(roomSelectedDate) : "Today\u2019s"} Reservations</p>
            </div>
          </div>
        </div>
        <div className={`${cardCls} px-4 py-3`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><Users className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{reservations.filter((r) => r.checkIn > activeDate).length}</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">Upcoming Reservations</p>
            </div>
          </div>
        </div>
        <div className={`${cardCls} px-4 py-3`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400"><BedDouble className="h-4 w-4" /></div>
            <div>
              <p className="text-xl font-bold text-hotel-900 dark:text-white leading-tight">{new Set(reservations.map((r) => r.roomType)).size}</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">Room Types Booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Availability */}
      <div className={`${cardCls} p-4 mb-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"><BedDouble className="h-4 w-4" /></div>
            <div>
              <h3 className="text-sm font-semibold text-hotel-900 dark:text-white">Room Availability {roomSelectedDate ? formatDateLabel(roomSelectedDate) : 'Today'}</h3>
              <p className="text-[11px] text-hotel-500 dark:text-hotel-400"><span className="font-semibold text-emerald-600">{totalAvailable}</span> available &middot; <span className="font-semibold text-hotel-700 dark:text-hotel-300">{totalBooked}</span> booked &middot; {totalRooms} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-hotel-500 dark:text-hotel-400">Occupancy</span>
            <div className="w-24 h-1.5 rounded-full bg-hotel-100 dark:bg-hotel-800 overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${totalRooms > 0 ? ((totalBooked / totalRooms) * 100) : 0}%` }} /></div>
            <span className="text-[11px] font-bold text-hotel-700 dark:text-hotel-300">{totalRooms > 0 ? Math.round((totalBooked / totalRooms) * 100) : 0}%</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {availability.map((room) => {
            const pct = room.totalRooms > 0 ? (room.booked / room.totalRooms) * 100 : 0;
            return (
              <div key={room.id} className="rounded-lg border border-hotel-100 dark:border-dark-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: room.hex }} /><span className="text-xs font-medium text-hotel-800 dark:text-hotel-200">{room.name}</span></div>
                  {room.available > 0 ? <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /><span className="text-[11px] font-semibold text-emerald-600">{room.available} open</span></div> : <div className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /><span className="text-[11px] font-semibold text-red-500">Full</span></div>}
                </div>
                <div className="w-full h-1 rounded-full bg-hotel-100 dark:bg-hotel-800 overflow-hidden mb-1.5"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: room.hex }} /></div>
                <div className="flex items-center justify-between text-[11px] text-hotel-400"><span>{room.booked} booked</span><span>{room.totalRooms} total</span></div>
              </div>
            );
          })}
        </div>
      </div>

      {viewMode === 'calendar' && <AdminCalendar reservations={reservations} roomTypes={roomTypes} onDeleteReservation={deleteReservation} onDateSelect={setRoomSelectedDate} />}

      {viewMode === 'list' && <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hotel-400" />
              <input type="text" placeholder="Search by name, email, phone, or room type..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-12`} />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-hotel-400 hover:bg-hotel-100 hover:text-hotel-600 transition-colors"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all ${showFilters || hasActiveFilters ? 'border-gold-400 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400' : 'border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card text-hotel-600 dark:text-hotel-300 hover:border-hotel-300'}`}>
              <Filter className="h-4 w-4" />Filters
              {hasActiveFilters && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">{(roomFilter !== 'All Rooms' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}</span>}
            </button>
          </div>

          {showFilters && (
            <div className={`mb-6 rounded-xl ${cardCls} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-hotel-900 dark:text-white flex items-center gap-2"><Filter className="h-4 w-4 text-hotel-400" />Filter & Sort</h4>
                {hasActiveFilters && <button onClick={clearFilters} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"><X className="h-3 w-3" />Clear all</button>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={smallLabelCls}><BedDouble className="h-3.5 w-3.5" />Room Type</label><select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} className={selectCls}>{roomFilterOptions.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className={smallLabelCls}><CalendarDays className="h-3.5 w-3.5" />Status</label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className={selectCls}><option value="all">All Statuses</option><option value="upcoming">Upcoming</option><option value="current">Current Stay</option><option value="past">Past</option></select></div>
                <div><label className={smallLabelCls}><ArrowUpDown className="h-3.5 w-3.5" />Sort By</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className={selectCls}><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="checkIn-asc">Check-in (Earliest)</option><option value="checkIn-desc">Check-in (Latest)</option><option value="name-asc">Name (A-Z)</option><option value="guests-desc">Guests (Most)</option></select></div>
              </div>
            </div>
          )}

          {(search || hasActiveFilters) && filtered.length > 0 && <p className="mb-4 text-sm text-hotel-500 dark:text-hotel-400">Showing <span className="font-semibold text-hotel-700 dark:text-hotel-200">{filtered.length}</span> of <span className="font-semibold text-hotel-700 dark:text-hotel-200">{reservations.length}</span> reservations</p>}

          {filtered.length === 0 ? (
            <div className={`${cardCls} p-16 text-center`}>
              <ClipboardList className="mx-auto h-16 w-16 text-hotel-200 dark:text-hotel-600 mb-4" />
              <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-2">{reservations.length === 0 ? 'No Reservations Yet' : 'No Results Found'}</h3>
              <p className="text-hotel-500 dark:text-hotel-400 mb-4">{reservations.length === 0 ? 'Reservations from the booking form will appear here.' : 'Try adjusting your search or filters.'}</p>
              {(search || hasActiveFilters) && reservations.length > 0 && <button onClick={clearFilters} className="rounded-lg bg-hotel-100 dark:bg-hotel-800 px-4 py-2 text-sm font-medium text-hotel-700 dark:text-hotel-300 transition-colors hover:bg-hotel-200 dark:hover:bg-hotel-700">Clear All Filters</button>}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((reservation) => {
                const isExpanded = expandedId === reservation.id;
                return (
                  <div key={reservation.id} className={`${cardCls} overflow-hidden transition-shadow hover:shadow-md`}>
                    <div className="flex items-center p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : reservation.id)}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 font-bold text-sm">{reservation.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2"><h4 className="font-semibold text-hotel-900 dark:text-white truncate">{reservation.fullName}</h4>{getStatusBadge(reservation.checkIn, reservation.checkOut)}</div>
                          <p className="text-sm text-hotel-500 dark:text-hotel-400 truncate">{reservation.email}</p>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm text-hotel-600 dark:text-hotel-300">
                          <div className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-hotel-400" />{reservation.roomType}</div>
                          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-hotel-400" />{formatDate(reservation.checkIn)}</div>
                          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-hotel-400" />{reservation.adults + reservation.children}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(reservation); }} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-hotel-400" /> : <ChevronDown className="h-5 w-5 text-hotel-400" />}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 px-5 py-5">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Email</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{reservation.email}</p></div></div>
                          <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Phone</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{reservation.phone}</p></div></div>
                          <div className="flex items-start gap-3"><CalendarDays className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Stay Dates</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{formatDate(reservation.checkIn)} &mdash; {formatDate(reservation.checkOut)}</p></div></div>
                          <div className="flex items-start gap-3"><BedDouble className="h-4 w-4 mt-0.5 text-hotel-400" /><div><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider">Room &amp; Guests</p><p className="text-sm text-hotel-800 dark:text-hotel-200">{reservation.roomType} &middot; {reservation.adults} {reservation.adults === 1 ? 'adult' : 'adults'}{reservation.children > 0 && <>, {reservation.children} {reservation.children === 1 ? 'child' : 'children'}</>}</p></div></div>
                        </div>
                        {reservation.specialRequests && <div className={`mt-4 rounded-xl p-4 ${cardCls}`}><p className="text-xs text-hotel-400 font-medium uppercase tracking-wider mb-1">Special Requests</p><p className="text-sm text-hotel-700 dark:text-hotel-300">{reservation.specialRequests}</p></div>}
                        <p className="mt-4 text-xs text-hotel-400">Booked on {new Date(reservation.createdAt).toLocaleString()}</p>
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
          title="Delete Reservation"
          message={`Are you sure you want to delete the reservation for "${deleteTarget.fullName}"? This action cannot be undone.`}
          onConfirm={() => { deleteReservation(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
