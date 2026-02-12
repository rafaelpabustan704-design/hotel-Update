'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AdminAccount {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

const AUTH_KEY = 'hotel-admin-auth';
const ACCOUNTS_KEY = 'hotel-admin-accounts';

const DEFAULT_ACCOUNT: AdminAccount = {
  id: 'default-admin',
  username: 'admin',
  password: 'admin',
  createdAt: new Date().toISOString(),
};

function getAccounts(): AdminAccount[] {
  if (typeof window === 'undefined') return [DEFAULT_ACCOUNT];
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (stored) {
    const accounts: AdminAccount[] = JSON.parse(stored);
    return accounts.length > 0 ? accounts : [DEFAULT_ACCOUNT];
  }
  // Initialize with default account
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([DEFAULT_ACCOUNT]));
  return [DEFAULT_ACCOUNT];
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Check auth & load accounts on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      setIsAuthenticated(true);
      setCurrentUser(stored);
    }
    setAccounts(getAccounts());
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const allAccounts = getAccounts();
    const match = allAccounts.find(
      (a) => a.username === username && a.password === password,
    );
    if (match) {
      sessionStorage.setItem(AUTH_KEY, match.username);
      setIsAuthenticated(true);
      setCurrentUser(match.username);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const addAccount = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const allAccounts = getAccounts();
    if (allAccounts.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' };
    }
    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }
    const newAccount: AdminAccount = {
      id: crypto.randomUUID(),
      username,
      password,
      createdAt: new Date().toISOString(),
    };
    const updated = [...allAccounts, newAccount];
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
    setAccounts(updated);
    return { success: true };
  }, []);

  const deleteAccount = useCallback((id: string): { success: boolean; error?: string } => {
    const allAccounts = getAccounts();
    if (allAccounts.length <= 1) {
      return { success: false, error: 'Cannot delete the last admin account' };
    }
    const target = allAccounts.find((a) => a.id === id);
    if (target && target.username === currentUser) {
      return { success: false, error: 'Cannot delete your own account while logged in' };
    }
    const updated = allAccounts.filter((a) => a.id !== id);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
    setAccounts(updated);
    return { success: true };
  }, [currentUser]);

  return { isAuthenticated, isLoading, currentUser, accounts, login, logout, addAccount, deleteAccount };
}
