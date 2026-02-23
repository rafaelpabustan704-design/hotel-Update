'use client';

import { Hotel, LogOut, X, ChevronLeft as PanelClose, Sun, Moon, Menu } from 'lucide-react';
import { TABS, SECTION_LABELS, type AdminTab, type TabMeta } from '../_config/tabs';

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
  getCounts: (tab: AdminTab) => number | undefined;
}

export default function AdminSidebar({
  activeTab, setActiveTab, sidebarOpen, setSidebarOpen,
  mobileSidebarOpen, setMobileSidebarOpen,
  hotelShortName, theme, toggleTheme, logout, getCounts,
}: AdminSidebarProps) {
  const sidebarBtn = (tab: TabMeta) => {
    const count = getCounts(tab.id);
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          activeTab === tab.id ? 'bg-gold-600 text-white shadow-md shadow-gold-600/25' : 'text-hotel-400 hover:text-white hover:bg-white/10'
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
    tabs: TABS.filter((t) => t.section === section),
  }));

  return (
    <>
      {mobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

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
