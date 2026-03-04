'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    onItemsPerPageChange?: (count: number) => void;
    itemLabel?: string;
    perPageOptions?: number[];
}

/**
 * Generates the array of page numbers / ellipsis markers to render.
 * Always shows first, last, current, and one neighbor on each side.
 * Uses `null` to represent an ellipsis gap.
 */
function buildPageNumbers(current: number, total: number): (number | null)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | null)[] = [];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    pages.push(1);
    if (left > 2) pages.push(null);
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push(null);
    pages.push(total);

    return pages;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    itemLabel = 'items',
    perPageOptions = [10, 25, 50],
}: PaginationProps) {
    const pages = useMemo(() => buildPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

    // Don't show pagination if there's only one page (or none)
    if (totalPages <= 1) return null;

    const btnBase =
        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40';
    const btnActive =
        'bg-gold-600 text-white shadow-sm';
    const btnInactive =
        'text-hotel-600 dark:text-hotel-300 hover:bg-hotel-100 dark:hover:bg-hotel-800';
    const btnDisabled =
        'text-hotel-300 dark:text-hotel-600 cursor-not-allowed';

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info text */}
            <p className="text-xs text-hotel-500 dark:text-hotel-400 order-2 sm:order-1">
                Showing{' '}
                <span className="font-semibold text-hotel-700 dark:text-hotel-200">{startIndex}</span>
                –
                <span className="font-semibold text-hotel-700 dark:text-hotel-200">{endIndex}</span>
                {' '}of{' '}
                <span className="font-semibold text-hotel-700 dark:text-hotel-200">{totalItems}</span>
                {' '}{itemLabel}
            </p>

            {/* Page buttons */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
                >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                </button>

                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* Numbered pages */}
                {pages.map((page, idx) =>
                    page === null ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="flex h-8 w-6 items-center justify-center text-xs text-hotel-400 dark:text-hotel-500 select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                            className={`${btnBase} ${page === currentPage ? btnActive : btnInactive}`}
                        >
                            {page}
                        </button>
                    ),
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
                >
                    <ChevronsRight className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Items-per-page selector (optional) */}
            {onItemsPerPageChange && (
                <div className="flex items-center gap-2 order-3">
                    <label className="text-xs text-hotel-500 dark:text-hotel-400 whitespace-nowrap">Per page</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="rounded-lg border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-2 py-1.5 text-xs text-hotel-700 dark:text-hotel-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition"
                    >
                        {perPageOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
