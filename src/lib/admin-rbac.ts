import type { AdminAccount, Permission, Role } from '@/types';

const ADMIN_TABS = [
  'rooms', 'dining', 'contact-submissions',
  'room-types', 'manage-rooms',
  'hero', 'about', 'restaurants', 'signature-dishes',
  'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
  'site-settings', 'navigation', 'section-headers', 'notifications', 'settings',
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number];

type DbWithRbac = {
  roles?: Role[];
  permissions?: Permission[];
  adminAccounts: AdminAccount[];
};

export function getAdminTabs(): AdminTabId[] {
  return [...ADMIN_TABS];
}

function systemRoleId(name: string): string {
  return `role-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function permissionId(tab: string): string {
  return `perm-${tab}-access`;
}

function permissionCode(tab: string): string {
  return `${tab}:access`;
}

function permissionTabs(permission: Permission): string[] {
  if (Array.isArray(permission.tabs) && permission.tabs.length > 0) return permission.tabs;
  if (typeof permission.tab === 'string' && permission.tab) return [permission.tab];
  return [];
}

export function buildDefaultPermissions(nowIso: string): Permission[] {
  return ADMIN_TABS.map((tab) => ({
    id: permissionId(tab),
    name: `${tab.replace(/-/g, ' ')} access`,
    code: permissionCode(tab),
    tabs: [tab],
    tab,
    action: 'manage',
    createdAt: nowIso,
    updatedAt: nowIso,
  }));
}

export function buildDefaultRoles(nowIso: string): Role[] {
  const allPermissionIds = ADMIN_TABS.map((tab) => permissionId(tab));
  return [
    {
      id: systemRoleId('Super Admin'),
      name: 'Super Admin',
      description: 'Full access to all admin tabs',
      isSystem: true,
      permissionIds: allPermissionIds,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: systemRoleId('Reservations Manager'),
      name: 'Reservations Manager',
      description: 'Access to reservation operations',
      isSystem: true,
      permissionIds: ['rooms', 'dining', 'contact-submissions', 'notifications'].map(permissionId),
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: systemRoleId('Content Editor'),
      name: 'Content Editor',
      description: 'Access to CMS and site configuration',
      isSystem: true,
      permissionIds: [
        'room-types', 'manage-rooms',
        'hero', 'about', 'restaurants', 'signature-dishes',
        'dining-highlights', 'cms-amenities', 'availability-content', 'contact',
        'site-settings', 'navigation', 'section-headers',
      ].map(permissionId),
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: systemRoleId('Custom'),
      name: 'Custom',
      description: 'Custom role template',
      isSystem: true,
      permissionIds: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];
}

export function ensureRbacCollections(db: DbWithRbac): { changed: boolean } {
  let changed = false;
  const nowIso = new Date().toISOString();
  const defaultPermissions = buildDefaultPermissions(nowIso);
  const defaultRoles = buildDefaultRoles(nowIso);

  if (!Array.isArray(db.permissions) || db.permissions.length === 0) {
    db.permissions = defaultPermissions;
    changed = true;
  } else {
    for (const permission of db.permissions) {
      const normalizedTabs = permissionTabs(permission);
      if ((!Array.isArray(permission.tabs) || permission.tabs.length === 0) && normalizedTabs.length > 0) {
        permission.tabs = normalizedTabs;
        changed = true;
      }
      if (!permission.name) {
        permission.name = permission.code || normalizedTabs.join(', ');
        changed = true;
      }
    }

    for (const basePermission of defaultPermissions) {
      const existing = db.permissions.find(
        (permission) => (permission.code || '').toLowerCase() === (basePermission.code || '').toLowerCase(),
      );
      if (!existing) {
        db.permissions.push(basePermission);
        changed = true;
      }
    }
  }

  if (!Array.isArray(db.roles) || db.roles.length === 0) {
    db.roles = defaultRoles;
    changed = true;
  } else {
    for (const baseRole of defaultRoles) {
      const existing = db.roles.find((role) => role.name === baseRole.name);
      if (!existing) {
        db.roles.push(baseRole);
        changed = true;
        continue;
      }
      if (existing.isSystem) {
        const expectedIds = new Set(baseRole.permissionIds);
        const hasDifference = existing.permissionIds.length !== baseRole.permissionIds.length
          || existing.permissionIds.some((permissionId) => !expectedIds.has(permissionId));
        if (hasDifference) {
          existing.permissionIds = [...baseRole.permissionIds];
          existing.updatedAt = nowIso;
          changed = true;
        }
      }
    }
  }
  const roleByName = new Map((db.roles ?? []).map((role) => [role.name, role]));
  const permissionByTab = new Map<string, Permission>();
  for (const permission of db.permissions ?? []) {
    for (const tab of permissionTabs(permission)) {
      if (!permissionByTab.has(tab)) permissionByTab.set(tab, permission);
    }
  }

  for (const account of db.adminAccounts) {
    if (account.roleId && (db.roles ?? []).some((role) => role.id === account.roleId)) {
      continue;
    }

    const legacyRole = account.role || 'Super Admin';
    if (legacyRole === 'Custom') {
      const legacyTabs = Array.isArray(account.permissions) ? account.permissions : [];
      const customRoleId = `legacy-custom-${account.id}`;

      if (!(db.roles ?? []).some((role) => role.id === customRoleId)) {
        const permissionIds = legacyTabs
          .map((tab) => permissionByTab.get(tab)?.id)
          .filter((value): value is string => Boolean(value));

        db.roles?.push({
          id: customRoleId,
          name: `Custom (${account.username})`,
          description: 'Migrated custom role',
          isSystem: false,
          permissionIds,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
      account.roleId = customRoleId;
      changed = true;
      continue;
    }

    const mappedRole = roleByName.get(legacyRole) ?? roleByName.get('Super Admin');
    if (mappedRole) {
      account.roleId = mappedRole.id;
      changed = true;
    }
  }

  return { changed };
}

export function resolveRole(db: DbWithRbac, account: AdminAccount): Role | null {
  if (!Array.isArray(db.roles)) return null;

  if (account.roleId) {
    const directRole = db.roles.find((role) => role.id === account.roleId);
    if (directRole) return directRole;
  }

  if (account.role) {
    const byName = db.roles.find((role) => role.name === account.role);
    if (byName) return byName;
  }

  return db.roles.find((role) => role.name === 'Super Admin') ?? null;
}

export function resolvePermissionTabs(db: DbWithRbac, account: AdminAccount): string[] {
  const role = resolveRole(db, account);
  if (!role) return [];
  if (!Array.isArray(db.permissions)) return [];

  const permissionMap = new Map(db.permissions.map((permission) => [permission.id, permission]));
  const allTabs = role.permissionIds
    .flatMap((permissionId) => {
      const permission = permissionMap.get(permissionId);
      return permission ? permissionTabs(permission) : [];
    });
  return [...new Set(allTabs)];
}
