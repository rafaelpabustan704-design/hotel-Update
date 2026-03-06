'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminAccount, AdminRole } from '@/types';

export type { AdminAccount };

const AUTH_KEY = 'hotel-admin-auth';
const ROLE_KEY = 'hotel-admin-role';
const PERMS_KEY = 'hotel-admin-perms';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole>('Super Admin');
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      setIsAuthenticated(true);
      setCurrentUser(stored);
      setCurrentUserRole((sessionStorage.getItem(ROLE_KEY) as AdminRole) || 'Super Admin');
      try {
        setCurrentUserPermissions(JSON.parse(sessionStorage.getItem(PERMS_KEY) || '[]'));
      } catch {
        setCurrentUserPermissions([]);
      }
    }

    fetch('/api/admin/accounts')
      .then((res) => res.json())
      .then((data) => setAccounts(data))
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
        sessionStorage.setItem(PERMS_KEY, JSON.stringify(data.permissions || []));
        setIsAuthenticated(true);
        setCurrentUser(data.username);
        setCurrentUserRole(data.role || 'Super Admin');
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
    sessionStorage.removeItem(PERMS_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentUserRole('Super Admin');
    setCurrentUserPermissions([]);
  }, []);

  const addAccount = useCallback(async (data: { fullName: string; email: string; username: string; password: string; role?: AdminRole; permissions?: string[] }): Promise<{ success: boolean; error?: string }> => {
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

  const updateAccount = useCallback(async (id: string, data: { role: AdminRole; permissions?: string[]; newPassword?: string }): Promise<{ success: boolean; error?: string }> => {
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
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const deleteAccount = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (accounts.length <= 1) {
      return { success: false, error: 'Cannot delete the last admin account' };
    }
    const target = accounts.find((a) => a.id === id);
    if (target && target.username === currentUser) {
      return { success: false, error: 'Cannot delete your own account while logged in' };
    }

    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error };
      }
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, [accounts, currentUser]);

  return { isAuthenticated, isLoading, currentUser, currentUserRole, currentUserPermissions, accounts, login, logout, addAccount, updateAccount, deleteAccount };
}
