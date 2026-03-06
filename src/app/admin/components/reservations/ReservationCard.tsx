'use client';

import {
    Trash2, Mail, Phone, BedDouble, CalendarDays, Users,
    ChevronDown, ChevronUp,
} from 'lucide-react';
import type { Reservation } from '@/types';
import StatusBadge from '../StatusBadge';
import { cardCls, formatDate, getTodayStr } from '../shared';

interface ReservationCardProps {
    reservation: Reservation;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
}

/** Expandable reservation card with status badge, guest details, and special requests. */
export default function ReservationCard({ reservation, isExpanded, onToggle, onDelete }: ReservationCardProps) {
    const todayStr = getTodayStr();
    return (
        <div className={`${cardCls} overflow-hidden transition-shadow hover:shadow-md`}>
            <div className="flex items-center p-5 cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 font-bold text-sm">{reservation.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2"><h4 className="font-semibold text-hotel-900 dark:text-white truncate">{reservation.fullName}</h4><StatusBadge checkIn={reservation.checkIn} checkOut={reservation.checkOut} todayStr={todayStr} /></div>
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
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
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
}
