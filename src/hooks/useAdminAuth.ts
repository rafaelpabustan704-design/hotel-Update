'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminAccount } from '@/types';

export type { AdminAccount };

const AUTH_KEY = 'hotel-admin-auth';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      setIsAuthenticated(true);
      setCurrentUser(stored);
    }

    fetch('/api/admin/accounts')
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch(() => {})
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
        setIsAuthenticated(true);
        setCurrentUser(data.username);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const addAccount = useCallback(async (data: { fullName: string; email: string; username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
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

  return { isAuthenticated, isLoading, currentUser, accounts, login, logout, addAccount, deleteAccount };
}
