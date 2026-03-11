export type AdminRole = string;

export type AdminPermissionAction = 'read' | 'create' | 'update' | 'delete' | 'manage';

export interface Permission {
  id: string;
  name?: string;
  code: string;
  tabs?: string[];
  tab?: string; // legacy single-tab permission
  action: AdminPermissionAction;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissionIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  roleId?: string;
  role?: AdminRole; // legacy fallback for older db.json
  permissions?: string[];
  createdAt: string;
}

export interface HotelSettings {
  name: string;
  address: string;
}
