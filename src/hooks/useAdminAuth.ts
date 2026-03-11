'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminAccount, Role, Permission } from '@/types';

export type { AdminAccount };

const AUTH_KEY = 'hotel-admin-auth';
const ROLE_KEY = 'hotel-admin-role';
const ROLE_ID_KEY = 'hotel-admin-role-id';
const PERMS_KEY = 'hotel-admin-perms';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('Super Admin');
  const [currentUserRoleId, setCurrentUserRoleId] = useState<string | null>(null);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      setIsAuthenticated(true);
      setCurrentUser(stored);
      setCurrentUserRole(sessionStorage.getItem(ROLE_KEY) || 'Super Admin');
      setCurrentUserRoleId(sessionStorage.getItem(ROLE_ID_KEY));
      try {
        setCurrentUserPermissions(JSON.parse(sessionStorage.getItem(PERMS_KEY) || '[]'));
      } catch {
        setCurrentUserPermissions([]);
      }
    }

    Promise.all([
      fetch('/api/admin/accounts').then((res) => res.json()),
      fetch('/api/admin/roles').then((res) => res.json()),
      fetch('/api/admin/permissions').then((res) => res.json()),
    ])
      .then(([accountData, roleData, permissionData]) => {
        setAccounts(Array.isArray(accountData) ? accountData : []);
        setRoles(Array.isArray(roleData) ? roleData : []);
        setPermissions(Array.isArray(permissionData) ? permissionData : []);
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem(AUTH_KEY, data.username);
        sessionStorage.setItem(ROLE_KEY, data.role || 'Super Admin');
        sessionStorage.setItem(ROLE_ID_KEY, data.roleId || '');
        sessionStorage.setItem(PERMS_KEY, JSON.stringify(data.permissions || []));
        setIsAuthenticated(true);
        setCurrentUser(data.username);
        setCurrentUserRole(data.role || 'Super Admin');
        setCurrentUserRoleId(data.roleId || null);
        setCurrentUserPermissions(data.permissions || []);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(ROLE_ID_KEY);
    sessionStorage.removeItem(PERMS_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentUserRole('Super Admin');
    setCurrentUserRoleId(null);
    setCurrentUserPermissions([]);
  }, []);

  const addAccount = useCallback(async (data: { fullName: string; email: string; username: string; password: string; roleId?: string; role?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error };
      }
      setAccounts((prev) => [...prev, result]);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const updateAccount = useCallback(async (id: string, data: { fullName?: string; email?: string; username?: string; roleId?: string; role?: string; newPassword?: string }): Promise<{ success: boolean; error?: string }> => {
    const targetAccount = accounts.find((a) => a.id === id);
    const isCurrentUserAccount = targetAccount?.username === currentUser;

    try {
      const res = await fetch(`/api/admin/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error };
      }
      setAccounts((prev) => prev.map((a) => (a.id === id ? result : a)));
      if (isCurrentUserAccount) {
        const nextRole = result.role || 'Super Admin';
        const nextRoleId = result.roleId || null;
        const nextPermissions = Array.isArray(result.permissions) ? result.permissions : [];
        const nextUsername = result.username || currentUser || '';
        setCurrentUser(nextUsername);
        setCurrentUserRole(nextRole);
        setCurrentUserRoleId(nextRoleId);
        setCurrentUserPermissions(nextPermissions);
        sessionStorage.setItem(AUTH_KEY, nextUsername);
        sessionStorage.setItem(ROLE_KEY, nextRole);
        sessionStorage.setItem(ROLE_ID_KEY, nextRoleId || '');
        sessionStorage.setItem(PERMS_KEY, JSON.stringify(nextPermissions));
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, [accounts, currentUser]);

  const deleteAccount = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error };
      }
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      const deletedAccount = accounts.find((a) => a.id === id);
      if (deletedAccount?.username === currentUser) {
        logout();
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, [accounts, currentUser, logout]);

  const addRole = useCallback(async (data: { name: string; description?: string; permissionIds?: string[] }) => {
    const res = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setRoles((prev) => [...prev, result]);
    return { success: true };
  }, []);

  const updateRole = useCallback(async (id: string, data: { name?: string; description?: string; permissionIds?: string[] }) => {
    const res = await fetch(`/api/admin/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setRoles((prev) => prev.map((role) => (role.id === id ? result : role)));
    return { success: true };
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setRoles((prev) => prev.filter((role) => role.id !== id));
    return { success: true };
  }, []);

  const addPermission = useCallback(async (data: { name: string; tabs: string[]; action?: string; code?: string; description?: string }) => {
    const res = await fetch('/api/admin/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setPermissions((prev) => [...prev, result]);
    return { success: true };
  }, []);

  const updatePermission = useCallback(async (id: string, data: { name?: string; tabs?: string[]; tab?: string; action?: string; code?: string; description?: string }) => {
    const res = await fetch(`/api/admin/permissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setPermissions((prev) => prev.map((permission) => (permission.id === id ? result : permission)));
    return { success: true };
  }, []);

  const deletePermission = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/permissions/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error as string | undefined };
    setPermissions((prev) => prev.filter((permission) => permission.id !== id));
    return { success: true };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    currentUserRole,
    currentUserRoleId,
    currentUserPermissions,
    accounts,
    roles,
    permissions,
    login,
    logout,
    addAccount,
    updateAccount,
    deleteAccount,
    addRole,
    updateRole,
    deleteRole,
    addPermission,
    updatePermission,
    deletePermission,
  };
}
