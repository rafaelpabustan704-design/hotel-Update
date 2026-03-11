'use client';

import { ChevronDown } from 'lucide-react';
import { ROLES, ROLE_PERMISSIONS } from '@/app/admin/_config/permissions';
import { TABS } from '@/app/admin/_config/tabs';

/* ── Role colour map ── */
export const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    'Super Admin': { bg: 'bg-gold-50 dark:bg-gold-900/30', text: 'text-gold-700 dark:text-gold-400' },
    'Reservations Manager': { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    'Content Editor': { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    'Custom': { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400' },
};

/* ── RoleBadge ── */
export function RoleBadge({ role }: { role: string }) {
    const colors = ROLE_COLORS[role] || ROLE_COLORS['Super Admin'];
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
            {role}
        </span>
    );
}

/* ── RoleSelector ── */
export function RoleSelector({ value, roles, onChange }: { value: string; roles?: string[]; onChange: (role: string) => void }) {
    const options = Array.isArray(roles) && roles.length > 0 ? roles : ROLES;
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-3 pr-10 text-sm text-hotel-900 dark:text-hotel-100 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
                {options.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hotel-400 pointer-events-none" />
        </div>
    );
}

/* ── PermissionCheckboxes ── */
export function PermissionCheckboxes({ selected, onChange }: { selected: string[]; onChange: (perms: string[]) => void }) {
    const sections = [
        { label: 'Reservations', tabs: TABS.filter((t) => t.section === 'reservations') },
        { label: 'Management', tabs: TABS.filter((t) => t.section === 'management') },
        { label: 'Landing Page', tabs: TABS.filter((t) => t.section === 'landing') },
        { label: 'System', tabs: TABS.filter((t) => t.section === 'system') },
    ];

    const toggle = (id: string) => {
        onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    };

    return (
        <div className="space-y-4 mt-3">
            {sections.map((sec) => (
                <div key={sec.label}>
                    <p className="text-xs font-semibold text-hotel-500 dark:text-hotel-400 uppercase tracking-wider mb-2">{sec.label}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {sec.tabs.map((tab) => {
                            const Icon = tab.icon;
                            const checked = selected.includes(tab.id);
                            return (
                                <label
                                    key={tab.id}
                                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-all ${checked
                                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-300 shadow-sm'
                                        : 'border-hotel-200 dark:border-dark-border text-hotel-500 dark:text-hotel-400 hover:border-hotel-300 dark:hover:border-hotel-600'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggle(tab.id)}
                                        className="sr-only"
                                    />
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate text-xs font-medium">{tab.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── RoleDescription ── */
export function RoleDescription({ role }: { role: string }) {
    if (role === 'Super Admin') return <p className="text-xs text-hotel-400 mt-1">Full access to all admin features</p>;
    if (role === 'Custom') return <p className="text-xs text-hotel-400 mt-1">Select specific tabs this account can access</p>;
    const tabs = ROLE_PERMISSIONS[role] ?? [];
    const labels = tabs.map((id) => TABS.find((t) => t.id === id)?.label).filter(Boolean);
    return <p className="text-xs text-hotel-400 mt-1">{labels.length > 0 ? `Access to: ${labels.join(', ')}` : 'Customizable permissions'}</p>;
}
