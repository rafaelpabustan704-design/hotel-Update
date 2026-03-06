'use client';

import { Archive, BedDouble, CalendarDays, Users } from 'lucide-react';
import type { Reservation } from '@/types';
import MiniPagination, { paginateArray } from '@/components/ui/MiniPagination';
import { cardCls, formatDate } from '../shared';

interface ArchivedReservationsListProps {
    archivedReservations: Reservation[];
    archivePage: number;
    setArchivePage: (page: number) => void;
}

/** Displays a paginated list of archived (past) room reservations. */
export default function ArchivedReservationsList({ archivedReservations, archivePage, setArchivePage }: ArchivedReservationsListProps) {
    if (archivedReservations.length === 0) {
        return (
            <div className={`${cardCls} p-16 text-center`}>
                <Archive className="mx-auto h-16 w-16 text-hotel-200 dark:text-hotel-600 mb-4" />
                <h3 className="font-serif text-xl font-bold text-hotel-900 dark:text-white mb-2">No Archived Reservations</h3>
                <p className="text-hotel-500 dark:text-hotel-400">Past reservations will appear here after archiving.</p>
            </div>
        );
    }

    const { paged } = paginateArray(archivedReservations, archivePage);

    return (
        <div className="space-y-3">
            {paged.map((reservation) => (
                <div key={reservation.id} className={`${cardCls} p-4`}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hotel-100 dark:bg-hotel-800 text-hotel-500 dark:text-hotel-400 font-bold text-sm">{reservation.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-hotel-900 dark:text-white truncate">{reservation.fullName}</h4>
                                <span className="inline-flex items-center rounded-full bg-hotel-100 dark:bg-hotel-800 px-2 py-0.5 text-[10px] font-semibold text-hotel-500 dark:text-hotel-400">Archived</span>
                            </div>
                            <p className="text-sm text-hotel-500 dark:text-hotel-400 truncate">{reservation.email}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm text-hotel-500 dark:text-hotel-400">
                            <div className="flex items-center gap-2"><BedDouble className="h-4 w-4" />{reservation.roomType}</div>
                            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDate(reservation.checkIn)} — {formatDate(reservation.checkOut)}</div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4" />{reservation.adults + reservation.children}</div>
                        </div>
                    </div>
                </div>
            ))}
            <MiniPagination currentPage={archivePage} totalItems={archivedReservations.length} onPageChange={setArchivePage} />
        </div>
    );
}
