'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Hotel, LogOut, X, ChevronLeft as PanelClose, Sun, Moon, Menu, Shield, Bell } from 'lucide-react';
import { TABS, SECTION_LABELS, type AdminTab, type TabMeta } from '../_config/tabs';
import type { AdminRole } from '@/types/admin';
import { RoleBadge } from './RoleComponents';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  hotelShortName: string;
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
  currentUserName?: string | null;
  currentUserRole?: AdminRole;
  getCounts: (tab: AdminTab) => number | undefined;
  allowedTabs?: AdminTab[];
}

export default function AdminSidebar({
  activeTab, setActiveTab, sidebarOpen, setSidebarOpen,
  mobileSidebarOpen, setMobileSidebarOpen,
  hotelShortName, theme, toggleTheme, logout,
  currentUserName, currentUserRole,
  getCounts, allowedTabs,
}: AdminSidebarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationBtnRef = useRef<HTMLButtonElement>(null);
  const notificationPopupRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const profilePopupRef = useRef<HTMLDivElement>(null);

  const roomCount = getCounts('rooms') ?? 0;
  const diningCount = getCounts('dining') ?? 0;
  const inquiryCount = getCounts('contact-submissions') ?? 0;

  const [seenRoomCount, setSeenRoomCount] = useState<number | null>(null);
  const [seenDiningCount, setSeenDiningCount] = useState<number | null>(null);
  const [seenInquiryCount, setSeenInquiryCount] = useState<number | null>(null);

  // Keep baseline in sync until the user opens notifications for the first time.
  // On mount, counts start at 0 then jump once the API responds — null means
  // "baseline not yet locked in", so we keep updating it automatically.
  useEffect(() => {
    if (seenRoomCount === null) setSeenRoomCount(roomCount);
  }, [roomCount, seenRoomCount]);

  useEffect(() => {
    if (seenDiningCount === null) setSeenDiningCount(diningCount);
  }, [diningCount, seenDiningCount]);

  useEffect(() => {
    if (seenInquiryCount === null) setSeenInquiryCount(inquiryCount);
  }, [inquiryCount, seenInquiryCount]);

  const unreadRoomBookings = Math.max(roomCount - (seenRoomCount ?? roomCount), 0);
  const unreadDiningBookings = Math.max(diningCount - (seenDiningCount ?? diningCount), 0);
  const unreadInquiries = Math.max(inquiryCount - (seenInquiryCount ?? inquiryCount), 0);
  const hasUnread = unreadRoomBookings > 0 || unreadDiningBookings > 0 || unreadInquiries > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsOpen &&
        notificationPopupRef.current && !notificationPopupRef.current.contains(e.target as Node) &&
        notificationBtnRef.current && !notificationBtnRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
        setSeenRoomCount(roomCount);
        setSeenDiningCount(diningCount);
        setSeenInquiryCount(inquiryCount);
      }
      if (
        profileOpen &&
        profilePopupRef.current && !profilePopupRef.current.contains(e.target as Node) &&
        profileBtnRef.current && !profileBtnRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, profileOpen, roomCount, diningCount, inquiryCount]);

  const toggleNotifications = () => {
    setProfileOpen(false);
    setNotificationsOpen((open) => {
      const next = !open;
      if (open) {
        // Mark notifications as read when closing notifications popup.
        setSeenRoomCount(roomCount);
        setSeenDiningCount(diningCount);
        setSeenInquiryCount(inquiryCount);
      }
      return next;
    });
  };

  const toggleProfile = () => {
    setNotificationsOpen(false);
    setProfileOpen((v) => !v);
  };

  const goToNotificationTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    setNotificationsOpen(false);
    setSeenRoomCount(roomCount);
    setSeenDiningCount(diningCount);
    setSeenInquiryCount(inquiryCount);
  };

  const initials = (currentUserName || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sidebarBtn = (tab: TabMeta) => {
    const count = getCounts(tab.id);
    const Icon = tab.icon;
    return (
      <button
        key={`sidebar-${tab.section}-${tab.id}`}
        onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25' : 'text-hotel-400 hover:text-white hover:bg-white/10'
          } ${!sidebarOpen ? 'justify-center' : ''}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {sidebarOpen && <span className="truncate">{tab.label}</span>}
        {sidebarOpen && count !== undefined && (
          <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-hotel-400'}`}>{count}</span>
        )}
      </button>
    );
  };

  const sections = (['reservations', 'management', 'landing', 'system'] as const).map((section) => ({
    label: SECTION_LABELS[section],
    tabs: TABS.filter((t) => t.section === section && (!allowedTabs || allowedTabs.includes(t.id))),
  })).filter((section) => section.tabs.length > 0);

  return (
    <>
      {mobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-screen bg-hotel-900 flex flex-col shrink-0 transition-all duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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

        <div className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1">
          {sections.map((section, i) => (
            <div key={section.label}>
              {i > 0 && <div className="h-px bg-white/10 my-3" />}
              <p className={`text-[10px] font-semibold uppercase tracking-wider text-hotel-500 mb-2 ${sidebarOpen ? 'px-2' : 'text-center'}`}>
                {sidebarOpen ? section.label : ''}
              </p>
              {section.tabs.map(sidebarBtn)}
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-white/10 p-3 space-y-1 relative">
          <button onClick={toggleTheme} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}>
            {theme === 'light' ? <Moon className="h-5 w-5 shrink-0" /> : <Sun className="h-5 w-5 shrink-0" />}
            {sidebarOpen && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>

          <div className="mt-1.5 space-y-1">
            <button
              ref={notificationBtnRef}
              type="button"
              onClick={toggleNotifications}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
              title="New activity"
            >
              <Bell className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>Notifications</span>}
              {hasUnread && (
                <span className={`absolute h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(15,23,42,1)] ${sidebarOpen ? 'right-3 top-1/2 -translate-y-1/2' : 'right-[22px] top-[9px]'}`} />
              )}
            </button>
            <button
              ref={profileBtnRef}
              type="button"
              onClick={toggleProfile}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-hotel-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
              title="Account"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-600/20 text-gold-200">
                {sidebarOpen ? <span className="text-[10px] font-bold">{initials}</span> : <Shield className="h-3.5 w-3.5" />}
              </div>
              {sidebarOpen && <span>Account</span>}
            </button>
          </div>

          {notificationsOpen && (
            <div ref={notificationPopupRef} className="absolute bottom-0 left-full ml-3 z-50 w-72 rounded-2xl border border-white/10 bg-[#0c1222] text-white shadow-2xl p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-hotel-300/80">
                  <Bell className="h-3.5 w-3.5" />
                  <span>Unread activity</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {unreadRoomBookings > 0 && (
                    <button
                      type="button"
                      onClick={() => goToNotificationTab('rooms')}
                      className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-hotel-200 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                      <span className="flex-1">Unread room bookings</span>
                      <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[11px] font-semibold">
                        {unreadRoomBookings}
                      </span>
                    </button>
                  )}
                  {unreadDiningBookings > 0 && (
                    <button
                      type="button"
                      onClick={() => goToNotificationTab('dining')}
                      className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-hotel-200 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                      <span className="flex-1">Unread dining reservations</span>
                      <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-blue-500/20 text-blue-300 px-2 py-0.5 text-[11px] font-semibold">
                        {unreadDiningBookings}
                      </span>
                    </button>
                  )}
                  {unreadInquiries > 0 && (
                    <button
                      type="button"
                      onClick={() => goToNotificationTab('contact-submissions')}
                      className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-hotel-200 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                      <span className="flex-1">Unread inquiries</span>
                      <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[11px] font-semibold">
                        {unreadInquiries}
                      </span>
                    </button>
                  )}
                  {!hasUnread && (
                    <p className="text-hotel-400">No unread notifications</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {profileOpen && (
            <div ref={profilePopupRef} className="absolute bottom-0 left-full ml-3 z-50 w-72 rounded-2xl border border-white/10 bg-[#0c1222] text-white shadow-2xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-600/25 text-gold-200">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{currentUserName || 'User'}</p>
                  {currentUserRole && (
                    <div className="mt-0.5">
                      <RoleBadge role={currentUserRole} />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/25 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ hotelShortName, theme, toggleTheme, onMenuClick }: {
  hotelShortName: string; theme: string; toggleTheme: () => void; onMenuClick: () => void;
}) {
  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-hotel-900 px-4 h-14 shadow-md">
      <button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-lg text-hotel-300 hover:text-white hover:bg-white/10 transition-colors"><Menu className="h-5 w-5" /></button>
      <Hotel className="h-5 w-5 text-gold-400" />
      <span className="font-serif text-base font-bold text-white">{hotelShortName}</span>
      <button onClick={toggleTheme} className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-hotel-300 hover:text-white hover:bg-white/10 transition-colors">
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    </div>
  );
}
