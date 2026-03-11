import type { AdminTab } from './tabs';

/**
 * Maps each pre-defined role to the tabs it has access to.
 * 'Super Admin' gets ALL tabs, so it uses a special '*' wildcard.
 */
export const ALL_TABS: AdminTab[] = [
    'rooms', 'dining', 'contact-submissions',
    'room-types', 'manage-rooms',
    'hero', 'about', 'restaurants', 'signature-dishes',
    'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
    'site-settings', 'navigation', 'section-headers', 'notifications', 'settings',
];

export const ROLE_PERMISSIONS: Record<string, AdminTab[]> = {
    'Super Admin': ALL_TABS,
    'Reservations Manager': ['rooms', 'dining', 'contact-submissions', 'notifications'],
    'Content Editor': [
        'room-types', 'manage-rooms',
        'hero', 'about', 'restaurants', 'signature-dishes',
        'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
        'site-settings', 'navigation', 'section-headers',
    ],
};

export const ROLES: string[] = ['Super Admin', 'Reservations Manager', 'Content Editor', 'Custom'];

/**
 * Returns the list of tabs a user is permitted to see based on resolved permissions.
 * If none are provided, uses sensible fallbacks for system roles.
 */
export function getPermittedTabs(roleName: string, resolvedPermissions?: string[]): AdminTab[] {
    if (Array.isArray(resolvedPermissions) && resolvedPermissions.length > 0) {
        const allowed = resolvedPermissions.filter((tab): tab is AdminTab => ALL_TABS.includes(tab as AdminTab));
        if (allowed.length > 0) {
            return allowed;
        }
    }
    return ROLE_PERMISSIONS[roleName] ?? ALL_TABS;
}
