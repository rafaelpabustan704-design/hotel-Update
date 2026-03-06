import React from 'react';

/** Section heading used in modal forms and detail panels. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h4 className="text-xs font-semibold uppercase tracking-wider text-hotel-400 dark:text-hotel-500 border-b border-hotel-100 dark:border-dark-border pb-2 mb-4">{children}</h4>;
}

/** Bordered card used to group related form fields. */
export function SectionCard({ children }: { children: React.ReactNode }) {
    return <div className="rounded-xl border border-hotel-100 dark:border-dark-border bg-hotel-50/50 dark:bg-dark-bg/50 p-4 flex flex-col">{children}</div>;
}

/** Format a number as Philippine Peso. */
export function formatPhp(value: number) {
    return `₱${value.toLocaleString('en-PH')}`;
}
