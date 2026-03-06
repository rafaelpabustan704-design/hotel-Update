import type { AdminRole } from '@/types/admin';
import type { AdminTab } from './tabs';

/**
 * Maps each pre-defined role to the tabs it has access to.
 * 'Super Admin' gets ALL tabs, so it uses a special '*' wildcard.
 */
const ALL_TABS: AdminTab[] = [
    'rooms', 'dining', 'contact-submissions',
    'room-types', 'manage-rooms',
    'hero', 'about', 'restaurants', 'signature-dishes',
    'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
    'site-settings', 'navigation', 'section-headers', 'settings',
];

export const ROLE_PERMISSIONS: Record<AdminRole, AdminTab[]> = {
    'Super Admin': ALL_TABS,
    'Reservations Manager': ['rooms', 'dining', 'contact-submissions'],
    'Content Editor': [
        'room-types', 'manage-rooms',
        'hero', 'about', 'restaurants', 'signature-dishes',
        'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
        'site-settings', 'navigation', 'section-headers',
    ],
    'Custom': [],
};

export const ROLES: AdminRole[] = ['Super Admin', 'Reservations Manager', 'Content Editor', 'Custom'];

/**
 * Returns the list of tabs a user is permitted to see.
 * For 'Custom' role, uses the explicit permissions array.
 * For predefined roles, uses the ROLE_PERMISSIONS map.
 */
export function getPermittedTabs(role: AdminRole, customPermissions?: string[]): AdminTab[] {
    if (role === 'Custom' && customPermissions) {
        return customPermissions as AdminTab[];
    }
    return ROLE_PERMISSIONS[role] ?? ALL_TABS;
}
