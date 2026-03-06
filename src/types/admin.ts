export type AdminRole = 'Super Admin' | 'Reservations Manager' | 'Content Editor' | 'Custom';

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: AdminRole;
  permissions?: string[];
  createdAt: string;
}

export interface HotelSettings {
  name: string;
  address: string;
}
