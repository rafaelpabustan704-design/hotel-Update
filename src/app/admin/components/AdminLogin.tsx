'use client';

import { useState, useEffect } from 'react';
import { Hotel, Lock, User, XCircle } from 'lucide-react';
import { inputCls, labelCls } from './shared';

interface AdminLoginProps {
  hotelName: string;
  isAuthenticated: boolean;
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ hotelName, isAuthenticated, onLogin }: AdminLoginProps) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { setLoginForm({ username: '', password: '' }); setLoginError(''); }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(loginForm.username, loginForm.password);
    if (!success) { setLoginError('Invalid username or password'); setTimeout(() => setLoginError(''), 3000); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-900 via-hotel-800 to-hotel-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gold-600/20 mb-4">
            <Hotel className="h-8 w-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">{hotelName.split(' ').slice(0, 2).join(' ') || 'Grand Horizon'}</h1>
          <p className="text-hotel-400 text-sm">Admin Panel</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-dark-card shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-hotel-100 dark:bg-hotel-800 mb-3">
              <Lock className="h-5 w-5 text-hotel-600 dark:text-hotel-300" />
            </div>
            <h2 className="font-serif text-xl font-bold text-hotel-900 dark:text-white">Welcome Back</h2>
            <p className="text-sm text-hotel-500 dark:text-hotel-400 mt-1">Sign in to manage reservations</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelCls}><User className="h-4 w-4 text-hotel-400" />Username</label>
              <input type="text" value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} placeholder="Enter username" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Lock className="h-4 w-4 text-hotel-400" />Password</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Enter password" required className={inputCls} />
            </div>
            {loginError && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{loginError}</p>}
            <button type="submit" className="w-full rounded-xl bg-gold-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 hover:shadow-gold-700/30 active:scale-[0.98]">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
