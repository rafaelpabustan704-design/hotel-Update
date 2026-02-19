'use client';

import { useState } from 'react';
import {
  Trash2, Users, Lock, User, UserPlus, Shield,
  CheckCircle2, XCircle, Mail,
} from 'lucide-react';
import type { AdminAccount } from '@/hooks/useAdminAuth';
import { cardCls, inputCls, labelCls } from './shared';
import ConfirmModal from './ConfirmModal';

interface SettingsTabProps {
  currentUser: string | null;
  accounts: AdminAccount[];
  addAccount: (data: { fullName: string; email: string; username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function SettingsTab({ currentUser, accounts, addAccount, deleteAccount }: SettingsTabProps) {
  const [newAdminForm, setNewAdminForm] = useState({ fullName: '', email: '', username: '', password: '' });
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  return (
    <div className="space-y-8">
      {/* Current user info */}
      {(() => {
        const me = accounts.find((a) => a.username === currentUser);
        return (
          <div className={`${cardCls} p-6`}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400"><Shield className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-hotel-500 dark:text-hotel-400">Logged in as</p>
                <p className="text-lg font-bold text-hotel-900 dark:text-white">{me?.fullName || currentUser}</p>
                {me?.email && <p className="text-xs text-hotel-400">{me.email}</p>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add new admin */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><UserPlus className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Add New Admin</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">Create a new admin account</p></div>
        </div>
        <form onSubmit={async (e) => { e.preventDefault(); const result = await addAccount(newAdminForm); if (result.success) { setNewAdminForm({ fullName: '', email: '', username: '', password: '' }); setAdminFormError(''); setAdminFormSuccess('Admin account created successfully'); setTimeout(() => setAdminFormSuccess(''), 3000); } else { setAdminFormSuccess(''); setAdminFormError(result.error || 'Failed to create account'); setTimeout(() => setAdminFormError(''), 3000); } }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}><User className="h-4 w-4 text-hotel-400" />Full Name</label><input type="text" value={newAdminForm.fullName} onChange={(e) => setNewAdminForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Juan Dela Cruz" required className={inputCls} /></div>
            <div><label className={labelCls}><Mail className="h-4 w-4 text-hotel-400" />Email</label><input type="email" value={newAdminForm.email} onChange={(e) => setNewAdminForm((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. juan@hotel.com" className={inputCls} /></div>
            <div><label className={labelCls}><User className="h-4 w-4 text-hotel-400" />Username</label><input type="text" value={newAdminForm.username} onChange={(e) => setNewAdminForm((p) => ({ ...p, username: e.target.value }))} placeholder="Min 3 characters" required minLength={3} className={inputCls} /></div>
            <div><label className={labelCls}><Lock className="h-4 w-4 text-hotel-400" />Password</label><input type="password" value={newAdminForm.password} onChange={(e) => setNewAdminForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min 4 characters" required minLength={4} className={inputCls} /></div>
          </div>
          {adminFormError && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{adminFormError}</p>}
          {adminFormSuccess && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{adminFormSuccess}</p>}
          <button type="submit" className="rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]">Add Admin</button>
        </form>
      </div>

      {/* Admin accounts list */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><Users className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-hotel-900 dark:text-white">Admin Accounts</h3><p className="text-xs text-hotel-500 dark:text-hotel-400">{accounts.length} account{accounts.length !== 1 ? 's' : ''} registered</p></div>
        </div>
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between rounded-xl border border-hotel-100 dark:border-dark-border p-4 transition-shadow hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 font-bold text-sm">{(account.fullName || account.username).split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-hotel-900 dark:text-white">{account.fullName || account.username}</p>
                    {account.username === currentUser && <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-300">You</span>}
                    {account.id === 'default-admin' && <span className="inline-flex items-center rounded-full bg-gold-50 dark:bg-gold-900/30 px-2 py-0.5 text-[10px] font-semibold text-gold-700 dark:text-gold-400">Default</span>}
                  </div>
                  <p className="text-xs text-hotel-400">@{account.username}{account.email ? ` · ${account.email}` : ''}</p>
                </div>
              </div>
              <button onClick={() => setDeleteTarget(account)} disabled={account.username === currentUser || accounts.length <= 1} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${account.username === currentUser || accounts.length <= 1 ? 'text-hotel-200 dark:text-hotel-700 cursor-not-allowed' : 'text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Account"
          message={`Are you sure you want to delete the account "${deleteTarget.username}"? This action cannot be undone.`}
          onConfirm={async () => { const result = await deleteAccount(deleteTarget.id); if (!result.success) { setAdminFormError(result.error || 'Failed to delete account'); setTimeout(() => setAdminFormError(''), 3000); } setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
