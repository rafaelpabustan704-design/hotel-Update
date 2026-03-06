'use client';

interface StatusBadgeProps {
    checkIn: string;
    checkOut: string;
    todayStr: string;
}

/**
 * Renders a coloured status pill (Upcoming / Current / Past)
 * based on the check-in/check-out dates relative to today.
 */
export default function StatusBadge({ checkIn, checkOut, todayStr }: StatusBadgeProps) {
    if (checkIn > todayStr)
        return <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">Upcoming</span>;
    if (checkIn <= todayStr && checkOut > todayStr)
        return <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-300">Current</span>;
    return <span className="inline-flex items-center rounded-full bg-hotel-100 dark:bg-hotel-800 px-2 py-0.5 text-[10px] font-semibold text-hotel-500 dark:text-hotel-400">Past</span>;
}
