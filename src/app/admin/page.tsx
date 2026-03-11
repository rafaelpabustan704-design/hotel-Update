'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Reservation, DiningReservation } from '@/types';
import { Hotel, Eye } from 'lucide-react';
import { useReservations } from '@/hooks/ReservationContext';
import { useDiningReservations } from '@/hooks/DiningReservationContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRoomTypes } from '@/hooks/RoomTypeContext';
import { useRooms } from '@/hooks/RoomContext';
import { useTheme } from '@/hooks/ThemeContext';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { TABS, type AdminTab } from './_config/tabs';
import { PREVIEW_MAP } from './_config/previews';
import { getPermittedTabs } from './_config/permissions';

import AdminLogin from './components/AdminLogin';
import AdminSidebar, { MobileHeader } from './_components/AdminSidebar';
import PreviewModal from './components/PreviewModal';
import RoomReservationsTab from './components/RoomReservationsTab';
import DiningReservationsTab from './components/DiningReservationsTab';
import RoomTypesTab from './components/RoomTypesTab';
import ManageRoomsTab from './components/ManageRoomsTab';
import SettingsTab from './components/SettingsTab';
import HeroTab from './components/HeroTab';
import AboutTab from './components/AboutTab';
import RestaurantsTab from './components/RestaurantsTab';
import SignatureDishesTab from './components/SignatureDishesTab';
import DiningHighlightsTab from './components/DiningHighlightsTab';
import AmenitiesTab from './components/AmenitiesTab';
import AvailabilityContentTab from './components/AvailabilityContentTab';
import ContactTab from './components/ContactTab';
import SiteSettingsTab from './components/SiteSettingsTab';
import NavigationTab from './components/NavigationTab';
import SectionHeadersTab from './components/SectionHeadersTab';
import ContactSubmissionsTab from './components/ContactSubmissionsTab';
import type { ContactSubmission } from '@/types';

export default function AdminPage() {
  const { reservations, deleteReservation } = useReservations();
  const { diningReservations, deleteDiningReservation } = useDiningReservations();

  // Archived reservations state
  const [archivedReservations, setArchivedReservations] = useState<Reservation[]>([]);
  const [archivedDiningReservations, setArchivedDiningReservations] = useState<DiningReservation[]>([]);

  useEffect(() => {
    fetch('/api/reservations/archive').then((r) => r.json()).then(setArchivedReservations).catch(() => { });
    fetch('/api/dining-reservations/archive').then((r) => r.json()).then(setArchivedDiningReservations).catch(() => { });
  }, []);

  const archivePastReservations = useCallback(async () => {
    const res = await fetch('/api/reservations/archive', { method: 'POST' });
    if (res.ok) {
      // Refetch both active (via context reload) and archived
      const archived = await fetch('/api/reservations/archive').then((r) => r.json());
      setArchivedReservations(archived);
      // Force a page-level refresh of reservations by reloading
      window.location.reload();
    }
  }, []);

  const archivePastDiningReservations = useCallback(async () => {
    const res = await fetch('/api/dining-reservations/archive', { method: 'POST' });
    if (res.ok) {
      const archived = await fetch('/api/dining-reservations/archive').then((r) => r.json());
      setArchivedDiningReservations(archived);
      window.location.reload();
    }
  }, []);
  const { roomTypes, addRoomType, updateRoomType, deleteRoomType } = useRoomTypes();
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { theme, toggleTheme } = useTheme();
  const auth = useAdminAuth();
  const lc = useLandingContent();

  const allowedTabs = useMemo(() => getPermittedTabs(auth.currentUserRole, auth.currentUserPermissions), [auth.currentUserRole, auth.currentUserPermissions]);

  const [adminTab, setAdminTab] = useState<AdminTab>(() => allowedTabs[0] || 'rooms');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!allowedTabs.includes(adminTab)) {
      setAdminTab((allowedTabs[0] || 'rooms') as AdminTab);
    }
  }, [adminTab, allowedTabs]);

  // Contact submissions state
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [archivedContactSubmissions, setArchivedContactSubmissions] = useState<ContactSubmission[]>([]);
  useEffect(() => {
    // Auto-archive inquiries older than 14 days, then fetch both lists
    fetch('/api/contact-submissions/archive', { method: 'POST' })
      .then(() => Promise.all([
        fetch('/api/contact-submissions').then((r) => r.json()),
        fetch('/api/contact-submissions/archive').then((r) => r.json()),
      ]))
      .then(([active, archived]) => {
        setContactSubmissions(active);
        setArchivedContactSubmissions(archived);
      })
      .catch(() => {
        // Fallback: just fetch active
        fetch('/api/contact-submissions').then((r) => r.json()).then(setContactSubmissions).catch(() => { });
      });
  }, []);
  const deleteContactSubmission = useCallback(async (id: string) => {
    await fetch(`/api/contact-submissions/${id}`, { method: 'DELETE' });
    setContactSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);
  const addContactSubmission = useCallback(async (data: Omit<ContactSubmission, 'id'>) => {
    const res = await fetch('/api/contact-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const item = await res.json();
    setContactSubmissions((prev) => [...prev, item]);
  }, []);

  const getCounts = useCallback((tab: AdminTab): number | undefined => {
    const map: Partial<Record<AdminTab, number>> = {
      rooms: reservations.length, dining: diningReservations.length, 'contact-submissions': contactSubmissions.length,
      'room-types': roomTypes.length, 'manage-rooms': rooms.length,
      restaurants: lc.restaurants.length, 'signature-dishes': lc.signatureDishes.length,
      'dining-highlights': lc.diningHighlights.length, 'cms-amenities': lc.amenities.length,
      contact: lc.contactItems.length,
    };
    return map[tab];
  }, [reservations.length, diningReservations.length, contactSubmissions.length, roomTypes.length, rooms.length, lc.restaurants.length, lc.signatureDishes.length, lc.diningHighlights.length, lc.amenities.length, lc.contactItems.length]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-hotel-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Hotel className="h-8 w-8 text-gold-600" />
          <span className="font-serif text-xl font-bold text-hotel-900 dark:text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AdminLogin isAuthenticated={auth.isAuthenticated} onLogin={auth.login} />;
  }

  const displayName = lc.siteSettings.name || 'Grand Horizon Hotel & Resort';
  const hotelShortName = displayName.split(' ').slice(0, 2).join(' ');
  const meta = TABS.find((t) => t.id === adminTab)!;
  const preview = PREVIEW_MAP[adminTab];
  const currentAccount = auth.accounts.find((a) => a.username === auth.currentUser);
  const currentUserName = currentAccount?.fullName || auth.currentUser;

  return (
    <div className="min-h-screen bg-hotel-50 dark:bg-dark-bg flex transition-colors">
      <AdminSidebar
        activeTab={adminTab} setActiveTab={(tab) => { setAdminTab(tab); setPreviewOpen(false); }}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen}
        hotelShortName={hotelShortName} theme={theme} toggleTheme={toggleTheme}
        logout={auth.logout} getCounts={getCounts}
        currentUserName={currentUserName}
        currentUserRole={auth.currentUserRole}
        allowedTabs={allowedTabs}
      />

      <main className="flex-1 min-w-0 flex flex-col min-h-screen lg:min-h-0">
        <MobileHeader hotelShortName={hotelShortName} theme={theme} toggleTheme={toggleTheme} onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-hotel-900 dark:text-white">{meta.title}</h1>
              <p className="text-sm text-hotel-500 dark:text-hotel-400 mt-0.5">{meta.description}</p>
            </div>
            {preview && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="shrink-0 flex items-center gap-2 rounded-xl border border-hotel-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-2.5 text-sm font-semibold text-hotel-700 dark:text-hotel-200 shadow-sm transition-all hover:border-gold-500 hover:text-gold-700 dark:hover:text-gold-400 hover:shadow-md active:scale-[0.98]"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            )}
          </div>

          <div className="transition-opacity duration-200">
            {adminTab === 'rooms' && <RoomReservationsTab reservations={reservations} deleteReservation={deleteReservation} roomTypes={roomTypes} archivedReservations={archivedReservations} onArchivePast={archivePastReservations} />}
            {adminTab === 'dining' && <DiningReservationsTab diningReservations={diningReservations} deleteDiningReservation={deleteDiningReservation} archivedDiningReservations={archivedDiningReservations} onArchivePast={archivePastDiningReservations} />}
            {adminTab === 'contact-submissions' && <ContactSubmissionsTab submissions={contactSubmissions} deleteSubmission={deleteContactSubmission} addSubmission={addContactSubmission} archivedSubmissions={archivedContactSubmissions} />}
            {adminTab === 'room-types' && <RoomTypesTab roomTypes={roomTypes} addRoomType={addRoomType} updateRoomType={updateRoomType} deleteRoomType={deleteRoomType} />}
            {adminTab === 'manage-rooms' && <ManageRoomsTab rooms={rooms} roomTypes={roomTypes} addRoom={addRoom} updateRoom={updateRoom} deleteRoom={deleteRoom} />}
            {adminTab === 'hero' && <HeroTab heroContent={lc.heroContent} onSave={lc.updateHero} />}
            {adminTab === 'about' && <AboutTab aboutContent={lc.aboutContent} onSave={lc.updateAbout} />}
            {adminTab === 'restaurants' && <RestaurantsTab restaurants={lc.restaurants} onAdd={lc.addRestaurant} onUpdate={lc.updateRestaurant} onDelete={lc.deleteRestaurant} />}
            {adminTab === 'signature-dishes' && <SignatureDishesTab dishes={lc.signatureDishes} onAdd={lc.addSignatureDish} onUpdate={lc.updateSignatureDish} onDelete={lc.deleteSignatureDish} />}
            {adminTab === 'dining-highlights' && <DiningHighlightsTab highlights={lc.diningHighlights} onAdd={lc.addDiningHighlight} onUpdate={lc.updateDiningHighlight} onDelete={lc.deleteDiningHighlight} />}
            {adminTab === 'cms-amenities' && <AmenitiesTab amenities={lc.amenities} onAdd={lc.addAmenity} onUpdate={lc.updateAmenity} onDelete={lc.deleteAmenity} />}
            {adminTab === 'availability-content' && <AvailabilityContentTab content={lc.availabilityContent} onSave={lc.updateAvailability} />}
            {adminTab === 'contact' && <ContactTab items={lc.contactItems} onAdd={lc.addContactItem} onUpdate={lc.updateContactItem} onDelete={lc.deleteContactItem} />}
            {adminTab === 'site-settings' && <SiteSettingsTab settings={lc.siteSettings} onSave={lc.updateSiteSettings} />}
            {adminTab === 'navigation' && <NavigationTab items={lc.navigation} onAdd={lc.addNavItem} onUpdate={lc.updateNavItem} onDelete={lc.deleteNavItem} onReorder={lc.updateNavigation} />}
            {adminTab === 'section-headers' && <SectionHeadersTab headers={lc.sectionHeaders} onSave={lc.updateSectionHeaders} />}
            {adminTab === 'notifications' && (
              <div className="rounded-2xl border border-hotel-100 dark:border-dark-border bg-white dark:bg-dark-card p-6">
                <h3 className="font-semibold text-hotel-900 dark:text-white">Notifications Access</h3>
                <p className="text-sm text-hotel-500 dark:text-hotel-400 mt-1">
                  This permission controls the notification center button in the sidebar.
                </p>
              </div>
            )}
            {adminTab === 'settings' && (
              <SettingsTab
                currentUser={auth.currentUser}
                accounts={auth.accounts}
                roles={auth.roles}
                permissions={auth.permissions}
                addAccount={auth.addAccount}
                updateAccount={auth.updateAccount}
                deleteAccount={auth.deleteAccount}
                addRole={auth.addRole}
                updateRole={auth.updateRole}
                deleteRole={auth.deleteRole}
                addPermission={auth.addPermission}
                updatePermission={auth.updatePermission}
                deletePermission={auth.deletePermission}
              />
            )}
          </div>
        </div>

        <div className="mt-auto border-t border-hotel-200 dark:border-dark-border pt-4 pb-4 flex items-center justify-center text-xs text-hotel-400 px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} {displayName}</p>
        </div>
      </main>

      {previewOpen && preview && (
        <PreviewModal title={preview.label} onClose={() => setPreviewOpen(false)}>
          {preview.render()}
        </PreviewModal>
      )}
    </div>
  );
}
