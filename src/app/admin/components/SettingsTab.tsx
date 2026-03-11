'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Trash2, Users, Lock, User, UserPlus, Shield,
  CheckCircle2, XCircle, Mail, Pencil, X,
  Search,
} from 'lucide-react';
import type { AdminAccount } from '@/hooks/useAdminAuth';
import type { Permission, Role } from '@/types/admin';
import MiniPagination, { paginateArray } from '@/components/ui/MiniPagination';
import { RoleBadge, RoleSelector, PermissionCheckboxes, RoleDescription } from '../_components/RoleComponents';
import { TABS } from '../_config/tabs';
import { cardCls, inputCls, labelCls, selectCls } from './shared';
import ConfirmModal from './ConfirmModal';

interface SettingsTabProps {
  currentUser: string | null;
  accounts: AdminAccount[];
  roles: Role[];
  permissions: Permission[];
  addAccount: (data: { fullName: string; email: string; username: string; password: string; roleId?: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  updateAccount: (id: string, data: { fullName?: string; email?: string; username?: string; roleId?: string; role?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (id: string) => Promise<{ success: boolean; error?: string }>;
  addRole: (data: { name: string; description?: string; permissionIds?: string[] }) => Promise<{ success: boolean; error?: string }>;
  updateRole: (id: string, data: { name?: string; description?: string; permissionIds?: string[] }) => Promise<{ success: boolean; error?: string }>;
  deleteRole: (id: string) => Promise<{ success: boolean; error?: string }>;
  addPermission: (data: { name: string; tabs: string[]; action?: string; code?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  updatePermission: (id: string, data: { name?: string; tabs?: string[]; action?: string; code?: string; description?: string }) => Promise<{ success: boolean; error?: string }>;
  deletePermission: (id: string) => Promise<{ success: boolean; error?: string }>;
}

interface UserAccountFormModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  icon: ReactNode;
  submitLabel: string;
  form: { fullName: string; email: string; username: string; password: string };
  role: string;
  roleOptions: string[];
  error: string;
  success: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordRequired: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onFormChange: (updater: (prev: { fullName: string; email: string; username: string; password: string }) => { fullName: string; email: string; username: string; password: string }) => void;
  onRoleChange: (role: string) => void;
}

interface RoleFormModalProps {
  open: boolean;
  title: string;
  name: string;
  description: string;
  permissions: Permission[];
  selectedPermissionIds: string[];
  error: string;
  success: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTogglePermission: (permissionId: string) => void;
  onSubmit: () => Promise<void>;
}

interface PermissionFormModalProps {
  open: boolean;
  editingId: string | null;
  name: string;
  code: string;
  description: string;
  tabs: string[];
  error: string;
  success: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTabsChange: (tabs: string[]) => void;
  onSubmit: () => Promise<void>;
}

function UserAccountFormModal({
  open,
  title,
  subtitle,
  icon,
  submitLabel,
  form,
  role,
  roleOptions,
  error,
  success,
  passwordLabel,
  passwordPlaceholder,
  passwordRequired,
  onClose,
  onSubmit,
  onFormChange,
  onRoleChange,
}: UserAccountFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-hotel-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{icon}</div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">{title}</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit();
          }}
          className="p-6 space-y-4 max-h-[75vh] overflow-auto"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}><User className="h-4 w-4 text-hotel-400" />Full Name</label><input type="text" value={form.fullName} onChange={(e) => onFormChange((p) => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Juan Dela Cruz" required className={inputCls} /></div>
            <div><label className={labelCls}><Mail className="h-4 w-4 text-hotel-400" />Email</label><input type="email" value={form.email} onChange={(e) => onFormChange((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. juan@hotel.com" className={inputCls} /></div>
            <div><label className={labelCls}><User className="h-4 w-4 text-hotel-400" />Username</label><input type="text" value={form.username} onChange={(e) => onFormChange((p) => ({ ...p, username: e.target.value }))} placeholder="Min 3 characters" required minLength={3} className={inputCls} /></div>
            <div><label className={labelCls}><Lock className="h-4 w-4 text-hotel-400" />{passwordLabel}</label><input type="password" value={form.password} onChange={(e) => onFormChange((p) => ({ ...p, password: e.target.value }))} placeholder={passwordPlaceholder} minLength={4} required={passwordRequired} className={inputCls} /></div>
          </div>

          <div>
            <label className={labelCls}><Shield className="h-4 w-4 text-hotel-400" />Role</label>
            <RoleSelector value={role} roles={roleOptions} onChange={onRoleChange} />
            <RoleDescription role={role} />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-hotel-200 dark:border-dark-border px-5 py-2.5 text-sm font-semibold text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gold-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleFormModal({
  open,
  title,
  name,
  description,
  permissions,
  selectedPermissionIds,
  error,
  success,
  onClose,
  onNameChange,
  onDescriptionChange,
  onTogglePermission,
  onSubmit,
}: RoleFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-hotel-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">{title}</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">Assign permissions to this role</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit();
          }}
          className="p-6 space-y-4 max-h-[75vh] overflow-auto"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Role Name</label>
              <input value={name} onChange={(e) => onNameChange(e.target.value)} className={inputCls} placeholder="e.g. Front Desk Agent" />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input value={description} onChange={(e) => onDescriptionChange(e.target.value)} className={inputCls} placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Permissions</label>
            <div className="space-y-2 mt-3">
              {permissions.map((permission) => {
                const tabs = Array.isArray(permission.tabs) && permission.tabs.length > 0
                  ? permission.tabs
                  : (permission.tab ? [permission.tab] : []);
                const tabLabels = tabs
                  .map((tabId) => TABS.find((tab) => tab.id === tabId)?.label || tabId)
                  .join(', ');
                const checked = selectedPermissionIds.includes(permission.id);
                return (
                  <label
                    key={permission.id}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-all ${checked
                      ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-300 shadow-sm'
                      : 'border-hotel-200 dark:border-dark-border text-hotel-500 dark:text-hotel-400 hover:border-hotel-300 dark:hover:border-hotel-600'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onTogglePermission(permission.id)}
                      className="mt-0.5"
                    />
                    <span className="flex-1">
                      <span className="block text-xs font-semibold">{permission.name || permission.code}</span>
                      <span className="block text-[11px] opacity-75">{tabLabels || 'No tabs configured'}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-hotel-200 dark:border-dark-border px-5 py-2.5 text-sm font-semibold text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gold-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PermissionFormModal({
  open,
  editingId,
  name,
  code,
  description,
  tabs,
  error,
  success,
  onClose,
  onNameChange,
  onCodeChange,
  onDescriptionChange,
  onTabsChange,
  onSubmit,
}: PermissionFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-dark-card border border-hotel-100 dark:border-dark-border shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-hotel-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">{editingId ? 'Edit Permission' : 'Create Permission'}</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">Set permission details and allowed tabs</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800 hover:text-hotel-700 dark:hover:text-hotel-200 transition-colors" title="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={async (e) => { e.preventDefault(); await onSubmit(); }}
          className="p-6 space-y-4 max-h-[75vh] overflow-auto"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Permission Name</label>
              <input value={name} onChange={(e) => onNameChange(e.target.value)} className={inputCls} placeholder="e.g. Front Desk Access" />
            </div>
            <div>
              <label className={labelCls}>Permission Code</label>
              <input value={code} onChange={(e) => onCodeChange(e.target.value)} className={inputCls} placeholder="e.g. frontdesk:access" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <input value={description} onChange={(e) => onDescriptionChange(e.target.value)} className={inputCls} placeholder="Optional" />
          </div>
          <div>
            <label className={labelCls}>Allowed Tabs for this Permission</label>
            <PermissionCheckboxes selected={tabs} onChange={onTabsChange} />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</p>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-hotel-200 dark:border-dark-border px-5 py-2.5 text-sm font-semibold text-hotel-600 dark:text-hotel-300 hover:bg-hotel-50 dark:hover:bg-hotel-800 transition-colors">Cancel</button>
            <button type="submit" className="rounded-xl bg-gold-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]">Save Permission</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SettingsTab({
  currentUser,
  accounts,
  roles,
  permissions,
  addAccount,
  updateAccount,
  deleteAccount,
  addRole,
  updateRole,
  deleteRole,
  addPermission,
  updatePermission,
  deletePermission,
}: SettingsTabProps) {
  const [newAdminForm, setNewAdminForm] = useState({ fullName: '', email: '', username: '', password: '' });
  const [newAdminRole, setNewAdminRole] = useState('Super Admin');
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [editAdminForm, setEditAdminForm] = useState({ fullName: '', email: '', username: '', password: '' });
  const [editAdminRole, setEditAdminRole] = useState('Super Admin');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDescription, setRoleFormDescription] = useState('');
  const [roleFormPermissionIds, setRoleFormPermissionIds] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleFormError, setRoleFormError] = useState('');
  const [roleFormSuccess, setRoleFormSuccess] = useState('');
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<Role | null>(null);
  const [permissionFormName, setPermissionFormName] = useState('');
  const [permissionFormCode, setPermissionFormCode] = useState('');
  const [permissionFormDescription, setPermissionFormDescription] = useState('');
  const [permissionFormTabs, setPermissionFormTabs] = useState<string[]>([]);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);
  const [permissionFormError, setPermissionFormError] = useState('');
  const [permissionFormSuccess, setPermissionFormSuccess] = useState('');
  const [deletePermissionTarget, setDeletePermissionTarget] = useState<Permission | null>(null);
  const [rolePage, setRolePage] = useState(0);
  const [permissionPage, setPermissionPage] = useState(0);

  const [accountQuery, setAccountQuery] = useState('');
  const [accountRoleFilter, setAccountRoleFilter] = useState<'All' | string>('All');

  const roleOptions = useMemo(() => roles.map((role) => role.name), [roles]);
  const roleNameToRoleId = useMemo(
    () => new Map(roles.map((role) => [role.name, role.id])),
    [roles],
  );

  const filteredAccounts = useMemo(() => {
    const q = accountQuery.trim().toLowerCase();
    return accounts.filter((a) => {
      const role = a.role || 'Super Admin';
      if (accountRoleFilter !== 'All' && role !== accountRoleFilter) return false;

      if (!q) return true;
      const haystack = `${a.fullName || ''} ${a.username || ''} ${a.email || ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [accounts, accountQuery, accountRoleFilter]);

  useEffect(() => {
    setPage(0);
  }, [accountQuery, accountRoleFilter]);

  useEffect(() => {
    const pageSize = 5;
    const maxPage = Math.max(0, Math.ceil(filteredAccounts.length / pageSize) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [filteredAccounts.length, page]);

  useEffect(() => { setRolePage(0); }, [roles.length]);
  useEffect(() => { setPermissionPage(0); }, [permissions.length]);

  const { paged: paginatedAccounts, total: totalAccounts } = paginateArray(filteredAccounts, page);
  const { paged: paginatedRoles, total: totalRoles } = paginateArray(roles, rolePage);
  const { paged: paginatedPermissions, total: totalPermissions } = paginateArray(permissions, permissionPage);
  const isAccountsFiltered = accountQuery.trim() !== '' || accountRoleFilter !== 'All';

  const startEdit = (acc: AdminAccount) => {
    setEditTarget(acc);
    setEditAdminForm({
      fullName: acc.fullName || '',
      email: acc.email || '',
      username: acc.username || '',
      password: '',
    });
    setEditAdminRole(acc.role || 'Super Admin');
    setEditError('');
    setEditSuccess('');
    setEditUserOpen(true);
  };

  const closeEditModal = () => {
    setEditUserOpen(false);
    setEditTarget(null);
    setEditError('');
    setEditSuccess('');
  };

  const saveEdit = async () => {
    if (!editTarget) return;

    if (editAdminForm.password && editAdminForm.password.length < 4) {
      setEditError('Password must be at least 4 characters');
      setTimeout(() => setEditError(''), 3000);
      return;
    }
    const payload = {
      fullName: editAdminForm.fullName,
      email: editAdminForm.email,
      username: editAdminForm.username,
      roleId: roleNameToRoleId.get(editAdminRole),
      role: editAdminRole,
      newPassword: editAdminForm.password || undefined,
    };
    const result = await updateAccount(editTarget.id, payload);
    if (result.success) {
      setEditSuccess('User updated successfully');
      setEditAdminForm((prev) => ({ ...prev, password: '' }));
      setTimeout(() => {
        setEditSuccess('');
        closeEditModal();
      }, 1200);
    } else {
      setEditError(result.error || 'Failed to update');
      setTimeout(() => setEditError(''), 3000);
    }
  };

  const resetRoleForm = (closeModal = false) => {
    setEditingRoleId(null);
    setRoleFormName('');
    setRoleFormDescription('');
    setRoleFormPermissionIds([]);
    setRoleFormError('');
    setRoleFormSuccess('');
    if (closeModal) setRoleModalOpen(false);
  };

  const startCreateRole = () => {
    resetRoleForm();
    setRoleModalOpen(true);
  };

  const beginEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleFormName(role.name);
    setRoleFormDescription(role.description || '');
    setRoleFormPermissionIds(role.permissionIds);
    setRoleFormError('');
    setRoleFormSuccess('');
    setRoleModalOpen(true);
  };

  const toggleRolePermission = (permissionId: string) => {
    setRoleFormPermissionIds((prev) => (
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    ));
  };

  const saveRole = async () => {
    const name = roleFormName.trim();
    if (!name) {
      setRoleFormError('Role name is required');
      setTimeout(() => setRoleFormError(''), 3000);
      return;
    }
    const permissionIds = roleFormPermissionIds;

    const payload = { name, description: roleFormDescription.trim(), permissionIds };
    const result = editingRoleId
      ? await updateRole(editingRoleId, payload)
      : await addRole(payload);

    if (result.success) {
      setRoleFormSuccess(editingRoleId ? 'Role updated successfully' : 'Role created successfully');
      setTimeout(() => {
        setRoleFormSuccess('');
        resetRoleForm(true);
      }, 1200);
    } else {
      setRoleFormError(result.error || 'Failed to save role');
      setTimeout(() => setRoleFormError(''), 3000);
    }
  };

  const resetPermissionForm = (closeModal = false) => {
    setEditingPermissionId(null);
    setPermissionFormName('');
    setPermissionFormCode('');
    setPermissionFormDescription('');
    setPermissionFormTabs([]);
    setPermissionFormError('');
    setPermissionFormSuccess('');
    if (closeModal) setPermissionModalOpen(false);
  };

  const startCreatePermission = () => {
    resetPermissionForm();
    setPermissionModalOpen(true);
  };

  const beginEditPermission = (permission: Permission) => {
    setEditingPermissionId(permission.id);
    setPermissionFormName(permission.name || permission.code);
    setPermissionFormCode(permission.code);
    setPermissionFormDescription(permission.description || '');
    setPermissionFormTabs(
      Array.isArray(permission.tabs) && permission.tabs.length > 0
        ? permission.tabs
        : (permission.tab ? [permission.tab] : []),
    );
    setPermissionFormError('');
    setPermissionFormSuccess('');
    setPermissionModalOpen(true);
  };

  const savePermission = async () => {
    const name = permissionFormName.trim();
    const code = permissionFormCode.trim();
    if (!name) {
      setPermissionFormError('Permission name is required');
      setTimeout(() => setPermissionFormError(''), 3000);
      return;
    }
    if (!code) {
      setPermissionFormError('Permission code is required');
      setTimeout(() => setPermissionFormError(''), 3000);
      return;
    }
    if (permissionFormTabs.length === 0) {
      setPermissionFormError('Select at least one tab for this permission');
      setTimeout(() => setPermissionFormError(''), 3000);
      return;
    }

    const payload = {
      name,
      code,
      description: permissionFormDescription.trim(),
      tabs: permissionFormTabs,
      action: 'manage' as const,
    };

    const result = editingPermissionId
      ? await updatePermission(editingPermissionId, payload)
      : await addPermission(payload);

    if (result.success) {
      setPermissionFormSuccess(editingPermissionId ? 'Permission updated successfully' : 'Permission created successfully');
      setTimeout(() => {
        setPermissionFormSuccess('');
        resetPermissionForm(true);
      }, 1200);
    } else {
      setPermissionFormError(result.error || 'Failed to save permission');
      setTimeout(() => setPermissionFormError(''), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin accounts list */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><Users className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold text-hotel-900 dark:text-white">Users</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">
                {isAccountsFiltered ? `${filteredAccounts.length} of ${accounts.length}` : accounts.length} account{accounts.length !== 1 ? 's' : ''} registered
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAdminFormError('');
              setAdminFormSuccess('');
              setNewAdminForm({ fullName: '', email: '', username: '', password: '' });
              setNewAdminRole('Super Admin');
              setAddUserOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-5">
          <div className="sm:col-span-2">
            <label className={labelCls}><Search className="h-4 w-4 text-hotel-400" />Search</label>
            <div className="relative">
              <input
                value={accountQuery}
                onChange={(e) => setAccountQuery(e.target.value)}
                placeholder="Search name, username, or email…"
                className={`${inputCls} pr-10`}
              />
              {accountQuery.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => setAccountQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-hotel-100 dark:hover:bg-hotel-800"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className={labelCls}><Shield className="h-4 w-4 text-hotel-400" />Role</label>
            <select
              value={accountRoleFilter}
              onChange={(e) => setAccountRoleFilter(e.target.value as 'All' | string)}
              className={selectCls}
            >
              <option value="All">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAccounts.length === 0 && (
            <div className="rounded-xl border border-dashed border-hotel-200 dark:border-dark-border p-6 text-center">
              <p className="text-sm font-semibold text-hotel-900 dark:text-white">No accounts found</p>
              <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-1">Try adjusting your search or role filter.</p>
            </div>
          )}
          {paginatedAccounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-4 transition-shadow hover:shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hotel-100 dark:bg-hotel-800 text-hotel-600 dark:text-hotel-300 font-bold text-sm">{(account.fullName || account.username).split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-hotel-900 dark:text-white">{account.fullName || account.username}</p>
                      {account.username === currentUser && <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-300">You</span>}
                      {account.id === 'default-admin' && <span className="inline-flex items-center rounded-full bg-gold-50 dark:bg-gold-900/30 px-2 py-0.5 text-[10px] font-semibold text-gold-700 dark:text-gold-400">Default</span>}
                      <RoleBadge role={account.role || 'Super Admin'} />
                    </div>
                    <p className="text-xs text-hotel-400">@{account.username}{account.email ? ` · ${account.email}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (editUserOpen && editTarget?.id === account.id) {
                        closeEditModal();
                        return;
                      }
                      startEdit(account);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"
                    title="Edit user"
                  >
                    {editUserOpen && editTarget?.id === account.id ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setDeleteTarget(account)} className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MiniPagination
          currentPage={page}
          totalItems={totalAccounts}
          onPageChange={setPage}
          className="border-t border-hotel-100 dark:border-dark-border mt-4 pt-4"
        />
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Account"
          message={`Are you sure you want to delete the account "${deleteTarget.username}"? This action cannot be undone.`}
          onConfirm={async () => { const result = await deleteAccount(deleteTarget.id); if (!result.success) { setAdminFormError(result.error || 'Failed to delete account'); setTimeout(() => setAdminFormError(''), 3000); } setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <UserAccountFormModal
        open={editUserOpen && !!editTarget}
        title="Edit User"
        subtitle="Update account details, role, and password"
        icon={<Pencil className="h-5 w-5" />}
        submitLabel="Save Changes"
        form={editAdminForm}
        role={editAdminRole}
        roleOptions={roleOptions}
        error={editError}
        success={editSuccess}
        passwordLabel="New Password"
        passwordPlaceholder="Leave blank to keep current password"
        passwordRequired={false}
        onClose={closeEditModal}
        onSubmit={saveEdit}
        onFormChange={setEditAdminForm}
        onRoleChange={setEditAdminRole}
      />

      <UserAccountFormModal
        open={addUserOpen}
        title="Add User"
        subtitle="Create a new user account with a role"
        icon={<UserPlus className="h-5 w-5" />}
        submitLabel="Add User"
        form={newAdminForm}
        role={newAdminRole}
        roleOptions={roleOptions}
        error={adminFormError}
        success={adminFormSuccess}
        passwordLabel="Password"
        passwordPlaceholder="Min 4 characters"
        passwordRequired
        onClose={() => {
          setAddUserOpen(false);
          setAdminFormError('');
          setAdminFormSuccess('');
        }}
        onSubmit={async () => {
          const result = await addAccount({
            ...newAdminForm,
            roleId: roleNameToRoleId.get(newAdminRole),
            role: newAdminRole,
          });
          if (result.success) {
            setNewAdminForm({ fullName: '', email: '', username: '', password: '' });
            setNewAdminRole('Super Admin');
            setAdminFormError('');
            setAdminFormSuccess('User account created successfully');
            setTimeout(() => {
              setAdminFormSuccess('');
              setAddUserOpen(false);
            }, 1200);
          } else {
            setAdminFormSuccess('');
            setAdminFormError(result.error || 'Failed to create account');
            setTimeout(() => setAdminFormError(''), 3000);
          }
        }}
        onFormChange={setNewAdminForm}
        onRoleChange={setNewAdminRole}
      />

      <div className={`${cardCls} p-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-hotel-900 dark:text-white">Roles</h3>
            <p className="text-xs text-hotel-500 dark:text-hotel-400">
              Create roles, then assign multiple permissions per role
            </p>
          </div>
          <button
            type="button"
            onClick={startCreateRole}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]"
          >
            <Shield className="h-4 w-4" />
            Add Role
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {paginatedRoles.map((role) => (
            <div key={role.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <RoleBadge role={role.name} />
                  {role.isSystem && <span className="text-[10px] font-semibold uppercase text-hotel-400">System</span>}
                </div>
                <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-1">{role.description || 'No description'}</p>
                <p className="text-[11px] text-hotel-400 mt-1">{role.permissionIds.length} permission(s) assigned</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => beginEditRole(role)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteRoleTarget(role)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <MiniPagination
          currentPage={rolePage}
          totalItems={totalRoles}
          onPageChange={setRolePage}
          className="border-t border-hotel-100 dark:border-dark-border mt-4 pt-4"
        />
        {roleFormError && <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{roleFormError}</p>}
      </div>

      {deleteRoleTarget && (
        <ConfirmModal
          title="Delete Role"
          message={`Are you sure you want to delete the role "${deleteRoleTarget.name}"? This action cannot be undone.`}
          onConfirm={async () => {
            const result = await deleteRole(deleteRoleTarget.id);
            if (!result.success) {
              setRoleFormError(result.error || 'Failed to delete role');
              setTimeout(() => setRoleFormError(''), 3000);
            }
            setDeleteRoleTarget(null);
          }}
          onCancel={() => setDeleteRoleTarget(null)}
        />
      )}

      <div className={`${cardCls} p-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-hotel-900 dark:text-white">Permissions</h3>
            <p className="text-xs text-hotel-500 dark:text-hotel-400">
              Define permissions and which tabs each permission can access
            </p>
          </div>
          <button
            type="button"
            onClick={startCreatePermission}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-600/25 transition-all hover:bg-gold-700 active:scale-[0.98]"
          >
            <Shield className="h-4 w-4" />
            Add Permission
          </button>
        </div>

        <div className="space-y-2">
          {paginatedPermissions.map((permission) => {
            const tabs = Array.isArray(permission.tabs) && permission.tabs.length > 0
              ? permission.tabs
              : (permission.tab ? [permission.tab] : []);
            const tabLabels = tabs
              .map((tabId) => TABS.find((tab) => tab.id === tabId)?.label || tabId)
              .join(', ');
            return (
              <div key={permission.id} className="rounded-xl border border-hotel-100 dark:border-dark-border p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-hotel-900 dark:text-white">{permission.name || permission.code}</p>
                  <p className="text-xs text-hotel-500 dark:text-hotel-400">{permission.code}</p>
                  <p className="text-[11px] text-hotel-400 mt-1">{tabLabels || 'No tabs configured'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => beginEditPermission(permission)} className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePermissionTarget(permission)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-hotel-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <MiniPagination
          currentPage={permissionPage}
          totalItems={totalPermissions}
          onPageChange={setPermissionPage}
          className="border-t border-hotel-100 dark:border-dark-border mt-4 pt-4"
        />
        {permissionFormError && <p className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" />{permissionFormError}</p>}
      </div>

      {deletePermissionTarget && (
        <ConfirmModal
          title="Delete Permission"
          message={`Are you sure you want to delete the permission "${deletePermissionTarget.name || deletePermissionTarget.code}"? This action cannot be undone.`}
          onConfirm={async () => {
            const result = await deletePermission(deletePermissionTarget.id);
            if (!result.success) {
              setPermissionFormError(result.error || 'Failed to delete permission');
              setTimeout(() => setPermissionFormError(''), 3000);
            }
            setDeletePermissionTarget(null);
          }}
          onCancel={() => setDeletePermissionTarget(null)}
        />
      )}

      <RoleFormModal
        open={roleModalOpen}
        title={editingRoleId ? 'Edit Role' : 'Create Role'}
        name={roleFormName}
        description={roleFormDescription}
        permissions={permissions}
        selectedPermissionIds={roleFormPermissionIds}
        error={roleFormError}
        success={roleFormSuccess}
        onClose={() => resetRoleForm(true)}
        onNameChange={setRoleFormName}
        onDescriptionChange={setRoleFormDescription}
        onTogglePermission={toggleRolePermission}
        onSubmit={saveRole}
      />

      <PermissionFormModal
        open={permissionModalOpen}
        editingId={editingPermissionId}
        name={permissionFormName}
        code={permissionFormCode}
        description={permissionFormDescription}
        tabs={permissionFormTabs}
        error={permissionFormError}
        success={permissionFormSuccess}
        onClose={() => resetPermissionForm(true)}
        onNameChange={setPermissionFormName}
        onCodeChange={setPermissionFormCode}
        onDescriptionChange={setPermissionFormDescription}
        onTabsChange={setPermissionFormTabs}
        onSubmit={savePermission}
      />
    </div>
  );
}
