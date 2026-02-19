export const cardCls = 'rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-sm';
export const inputCls = 'w-full rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-3 text-sm text-hotel-900 dark:text-hotel-100 placeholder:text-hotel-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors';
export const selectCls = 'w-full rounded-lg border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-hotel-900 dark:text-hotel-100 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition';
export const labelCls = 'mb-1.5 flex items-center gap-2 text-sm font-medium text-hotel-700 dark:text-hotel-300';
export const smallLabelCls = 'mb-1.5 flex items-center gap-1.5 text-xs font-medium text-hotel-500 dark:text-hotel-400';

export function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(timeStr: string) {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDateLabel(dateStr: string): string {
  const todayStr = getTodayStr();
  if (dateStr === todayStr) return "Today\u2019s";
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
