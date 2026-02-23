export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', hex: '#3b82f6', hexBg: '#eff6ff', hexText: '#1d4ed8' },
  { value: 'purple', label: 'Purple', hex: '#a855f7', hexBg: '#faf5ff', hexText: '#7e22ce' },
  { value: 'amber', label: 'Amber', hex: '#f59e0b', hexBg: '#fffbeb', hexText: '#b45309' },
  { value: 'green', label: 'Green', hex: '#22c55e', hexBg: '#f0fdf4', hexText: '#15803d' },
  { value: 'red', label: 'Red', hex: '#ef4444', hexBg: '#fef2f2', hexText: '#b91c1c' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4', hexBg: '#ecfeff', hexText: '#0e7490' },
  { value: 'pink', label: 'Pink', hex: '#ec4899', hexBg: '#fdf2f8', hexText: '#be185d' },
  { value: 'orange', label: 'Orange', hex: '#f97316', hexBg: '#fff7ed', hexText: '#c2410c' },
  { value: 'indigo', label: 'Indigo', hex: '#6366f1', hexBg: '#eef2ff', hexText: '#4338ca' },
  { value: 'teal', label: 'Teal', hex: '#14b8a6', hexBg: '#f0fdfa', hexText: '#0f766e' },
] as const;

const FALLBACK = { value: 'gray', label: 'Gray', hex: '#6b7280', hexBg: '#f9fafb', hexText: '#374151' } as const;

export function getColorClasses(color: string) {
  return COLOR_OPTIONS.find((c) => c.value === color) || FALLBACK;
}
