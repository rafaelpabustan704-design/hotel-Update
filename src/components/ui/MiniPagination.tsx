'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniPaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/**
 * Lightweight pagination component for small lists.
 * Shows page numbers, prev/next buttons, and "Showing X–Y of Z" text.
 * Only renders when totalItems >= pageSize.
 */
export default function MiniPagination({
    currentPage,
    totalItems,
    pageSize = 5,
    onPageChange,
    className = '',
}: MiniPaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalItems < pageSize) return null;

    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalItems);

    return (
        <div className={`flex items-center justify-between pt-3 ${className}`}>
            <p className="text-xs text-hotel-400">
                Showing {start}&ndash;{end} of {totalItems}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${currentPage === 0
                            ? 'text-hotel-200 dark:text-hotel-700 cursor-not-allowed'
                            : 'text-hotel-500 hover:bg-hotel-100 dark:hover:bg-hotel-800'
                        }`}
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`flex h-7 min-w-[28px] items-center justify-center rounded-lg text-xs font-semibold transition-colors ${currentPage === i
                                ? 'bg-gold-600 text-white shadow-sm'
                                : 'text-hotel-500 hover:bg-hotel-100 dark:hover:bg-hotel-800'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${currentPage >= totalPages - 1
                            ? 'text-hotel-200 dark:text-hotel-700 cursor-not-allowed'
                            : 'text-hotel-500 hover:bg-hotel-100 dark:hover:bg-hotel-800'
                        }`}
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

/**
 * Helper hook-like function to paginate an array.
 * Returns the sliced page and total item count.
 */
export function paginateArray<T>(items: T[], page: number, pageSize = 5): { paged: T[]; total: number } {
    if (items.length < pageSize) return { paged: items, total: items.length };
    return {
        paged: items.slice(page * pageSize, (page + 1) * pageSize),
        total: items.length,
    };
}
