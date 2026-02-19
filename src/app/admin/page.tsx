'use client';

import { useState } from 'react';
import {
  BedDouble, UtensilsCrossed,
  Hotel, LogOut, X, Menu,
  ChevronLeft as PanelClose,
  Settings, Sun, Moon, DoorOpen, Layers,
} from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { useDiningReservations } from '@/hooks/DiningReservationContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRoomTypes } from '@/hooks/RoomTypeContext';
import { useRooms } from '@/hooks/RoomContext';
import { useHotelSettings } from '@/hooks/HotelSettingsContext';
import { useTheme } from '@/hooks/ThemeContext';

import AdminLogin from './components/AdminLogin';
import RoomReservationsTab from './components/RoomReservationsTab';
import DiningReservationsTab from './components/DiningReservationsTab';
import RoomTypesTab from './components/RoomTypesTab';
import ManageRoomsTab from './components/ManageRoomsTab';
import SettingsTab from './components/SettingsTab';

type AdminTab = 'rooms' | 'dining' | 'room-types' | 'manage-rooms' | 'settings';

export default function AdminPage() {
  const { reservations, deleteReservation } = useReservations();
  const { diningReservations, deleteDiningReservation } = useDiningReservations();
  const { roomTypes, addRoomType, updateRoomType, deleteRoomType } = useRoomTypes();
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { settings } = useHotelSettings();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, currentUser, accounts, login, logout, addAccount, deleteAccount } = useAdminAuth();

  const [adminTab, setAdminTab] = useState<AdminTab>('rooms');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hotel-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Hotel className="h-8 w-8 text-gold-600" />
          <span className="font-serif text-xl font-bold text-hotel-900 dark:text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin hotelName={settings.name} isAuthenticated={isAuthenticated} onLogin={login} />;
  }

  const tabTitle: Record<AdminTab, string> = { rooms: 'Room Reservations', dining: 'Dining Reservations', 'room-types': 'Room Types', 'manage-rooms': 'Rooms', settings: 'Settings' };
  const tabDesc: Record<AdminTab, string> = { rooms: 'View and manage all room reservations', dining: 'View and manage all table reservations', 'room-types': 'Create and manage room type categories', 'manage-rooms': 'Manage individual rooms and their details', settings: 'Manage hotel information and admin accounts' };

  const sidebarBtn = (tab: AdminTab, icon: React.ReactNode, label: string, count?: number) => (
    <button
      onClick={() => { setAdminTab(tab); setMobileSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        adminTab === tab ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25' : 'text-hotel-400 hover:text-white hover:bg-white/10'
      } ${!sidebarOpen ? 'justify-center' : ''}`}
    >
      {icon}
      {sidebarOpen && <span>{label}</span>}
      {sidebarOpen && count !== undefined && (
        <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${adminTab === tab ? 'bg-white/20 text-white' : 'bg-white/10 text-hotel-400'}`}>{count}</span>
      )}
    </button>
  );

  const hotelShortName = settings.name.split(' ').slice(0, 2).join(' ') || 'Grand Horizon';

  return (
    <div className="min-h-screen bg-hotel-50 dark:bg-dark-bg flex transition-colors">
      {mobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen bg-hotel-900 flex flex-col shrink-0 transition-all duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:z-auto ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <Hotel className="h-7 w-7 text-gold-400 shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="font-serif text-lg font-bold text-white whitespace-nowrap">{hotelShortName}</span>
              <p className="text-[10px] text-hotel-400 uppercase tracking-wider">Admin Panel</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex ml-auto h-7 w-7 items-center justify-center rounded-lg text-hotel-400 hover:text-white hover:bg-white/10 transition-colors">
            <PanelClose className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden ml-auto h-7 w-7 flex items-center justify-center rounded-lg text-hotel-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>{sidebarOpen ? 'Reservations' : ''}</p>
          {sidebarBtn('rooms', <BedDouble className="h-5 w-5 shrink-0" />, 'Room Reservations', reservations.length)}
          {sidebarBtn('dining', <UtensilsCrossed className="h-5 w-5 shrink-0" />, 'Dining Reservations', diningReservations.length)}

          <div className="h-px bg-white/10 my-3" />
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>{sidebarOpen ? 'Management' : ''}</p>
          {sidebarBtn('room-types', <Layers className="h-5 w-5 shrink-0" />, 'Room Types', roomTypes.length)}
          {sidebarBtn('manage-rooms', <DoorOpen className="h-5 w-5 shrink-0" />, 'Rooms', rooms.length)}

          <div className="h-px bg-white/10 my-3" />
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>{sidebarOpen ? 'System' : ''}</p>
          {sidebarBtn('settings', <Settings className="h-5 w-5 shrink-0" />, 'Settings')}
        </div>

        <div className="shrink-0 border-t border-white/10 p-3 space-y-1">
          <button onClick={toggleTheme} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}>
            {theme === 'light' ? <Moon className="h-5 w-5 shrink-0" /> : <Sun className="h-5 w-5 shrink-0" />}
            {sidebarOpen && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <button onClick={logout} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}>
            <LogOut className="h-5 w-5 shrink-0" />{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen lg:min-h-0">
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-hotel-900 px-4 h-14 shadow-md">
          <button onClick={() => setMobileSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-300 hover:text-white hover:bg-white/10 transition-colors"><Menu className="h-5 w-5" /></button>
          <Hotel className="h-5 w-5 text-gold-400" />
          <span className="font-serif text-base font-bold text-white">{hotelShortName}</span>
          <button onClick={toggleTheme} className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-hotel-300 hover:text-white hover:bg-white/10 transition-colors">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-5">
            <h1 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white">{tabTitle[adminTab]}</h1>
            <p className="text-sm text-hotel-500 dark:text-hotel-400 mt-0.5">{tabDesc[adminTab]}</p>
          </div>

          <div className="transition-opacity duration-200">
          {adminTab === 'rooms' && (
            <RoomReservationsTab
              reservations={reservations}
              deleteReservation={deleteReservation}
              roomTypes={roomTypes}
            />
          )}

          {adminTab === 'dining' && (
            <DiningReservationsTab
              diningReservations={diningReservations}
              deleteDiningReservation={deleteDiningReservation}
            />
          )}

          {adminTab === 'room-types' && (
            <RoomTypesTab
              roomTypes={roomTypes}
              addRoomType={addRoomType}
              updateRoomType={updateRoomType}
              deleteRoomType={deleteRoomType}
            />
          )}

          {adminTab === 'manage-rooms' && (
            <ManageRoomsTab
              rooms={rooms}
              roomTypes={roomTypes}
              addRoom={addRoom}
              updateRoom={updateRoom}
              deleteRoom={deleteRoom}
            />
          )}

          {adminTab === 'settings' && (
            <SettingsTab
              currentUser={currentUser}
              accounts={accounts}
              addAccount={addAccount}
              deleteAccount={deleteAccount}
            />
          )}
          </div>
        </div>

        <div className="mt-auto border-t border-hotel-200 dark:border-dark-border pt-4 pb-4 flex items-center justify-center text-xs text-hotel-400 px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} {settings.name}</p>
        </div>
      </main>
    </div>
  );
}
