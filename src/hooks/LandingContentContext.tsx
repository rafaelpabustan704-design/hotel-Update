'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type {
  SiteSettings, NavigationItem, HeroContent, AboutContent,
  RestaurantItem, SignatureDish, DiningHighlight,
  AmenityItem, AvailabilityContent, ContactItem, SectionHeaders,
} from '@/types';
import {
  DEFAULT_SITE_SETTINGS, DEFAULT_HERO, DEFAULT_ABOUT,
  DEFAULT_AVAILABILITY, DEFAULT_SECTION_HEADERS,
} from '@/lib/constants';
import { useThemeColors } from '@/hooks/useThemeColors';

interface LandingContentContextType {
  siteSettings: SiteSettings;
  navigation: NavigationItem[];
  heroContent: HeroContent;
  aboutContent: AboutContent;
  restaurants: RestaurantItem[];
  signatureDishes: SignatureDish[];
  diningHighlights: DiningHighlight[];
  amenities: AmenityItem[];
  availabilityContent: AvailabilityContent;
  contactItems: ContactItem[];
  sectionHeaders: SectionHeaders;

  refetch: () => Promise<void>;

  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateNavigation: (items: NavigationItem[]) => Promise<void>;
  addNavItem: (data: Omit<NavigationItem, 'id'>) => Promise<void>;
  updateNavItem: (id: string, data: Partial<NavigationItem>) => Promise<void>;
  deleteNavItem: (id: string) => Promise<void>;
  updateHero: (data: Partial<HeroContent>) => Promise<void>;
  updateAbout: (data: Partial<AboutContent>) => Promise<void>;

  addRestaurant: (data: Omit<RestaurantItem, 'id'>) => Promise<void>;
  updateRestaurant: (id: string, data: Partial<RestaurantItem>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;

  addSignatureDish: (data: Omit<SignatureDish, 'id'>) => Promise<void>;
  updateSignatureDish: (id: string, data: Partial<SignatureDish>) => Promise<void>;
  deleteSignatureDish: (id: string) => Promise<void>;

  addDiningHighlight: (data: Omit<DiningHighlight, 'id'>) => Promise<void>;
  updateDiningHighlight: (id: string, data: Partial<DiningHighlight>) => Promise<void>;
  deleteDiningHighlight: (id: string) => Promise<void>;

  addAmenity: (data: Omit<AmenityItem, 'id'>) => Promise<void>;
  updateAmenity: (id: string, data: Partial<AmenityItem>) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;

  updateAvailability: (data: Partial<AvailabilityContent>) => Promise<void>;

  addContactItem: (data: Omit<ContactItem, 'id'>) => Promise<void>;
  updateContactItem: (id: string, data: Partial<ContactItem>) => Promise<void>;
  deleteContactItem: (id: string) => Promise<void>;

  updateSectionHeaders: (data: Partial<SectionHeaders>) => Promise<void>;
}

const LandingContentContext = createContext<LandingContentContextType | undefined>(undefined);

export function LandingContentProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [signatureDishes, setSignatureDishes] = useState<SignatureDish[]>([]);
  const [diningHighlights, setDiningHighlights] = useState<DiningHighlight[]>([]);
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  const [availabilityContent, setAvailabilityContent] = useState<AvailabilityContent>(DEFAULT_AVAILABILITY);
  const [contactItems, setContactItems] = useState<ContactItem[]>([]);
  const [sectionHeaders, setSectionHeaders] = useState<SectionHeaders>(DEFAULT_SECTION_HEADERS);
  const fetchedOnce = useRef(false);

  useThemeColors(siteSettings);

  const applyPayload = useCallback((d: Record<string, unknown>) => {
    if (d.siteSettings) setSiteSettings(d.siteSettings as SiteSettings);
    if (d.navigation) setNavigation(d.navigation as NavigationItem[]);
    if (d.heroContent) setHeroContent(d.heroContent as HeroContent);
    if (d.aboutContent) setAboutContent(d.aboutContent as AboutContent);
    if (d.restaurants) setRestaurants(d.restaurants as RestaurantItem[]);
    if (d.signatureDishes) setSignatureDishes(d.signatureDishes as SignatureDish[]);
    if (d.diningHighlights) setDiningHighlights(d.diningHighlights as DiningHighlight[]);
    if (d.amenities) setAmenities(d.amenities as AmenityItem[]);
    if (d.availabilityContent) setAvailabilityContent(d.availabilityContent as AvailabilityContent);
    if (d.contactItems) setContactItems(d.contactItems as ContactItem[]);
    if (d.sectionHeaders) setSectionHeaders(d.sectionHeaders as SectionHeaders);
  }, []);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/landing-content');
      applyPayload(await res.json());
    } catch { /* network error – keep stale state */ }
  }, [applyPayload]);

  useEffect(() => {
    if (!fetchedOnce.current) { fetchedOnce.current = true; refetch(); }
  }, [refetch]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') refetch(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refetch);
    return () => { document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', refetch); };
  }, [refetch]);

  const put = useCallback(async (path: string, body: unknown) => {
    const res = await fetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return res.json();
  }, []);

  const post = useCallback(async (path: string, body: unknown) => {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return res.json();
  }, []);

  const del = useCallback(async (path: string) => { await fetch(path, { method: 'DELETE' }); }, []);

  const ctx: LandingContentContextType = {
    siteSettings, navigation, heroContent, aboutContent,
    restaurants, signatureDishes, diningHighlights, amenities,
    availabilityContent, contactItems, sectionHeaders,
    refetch,

    updateSiteSettings: useCallback(async (data) => setSiteSettings(await put('/api/site-settings', data)), [put]),
    updateNavigation: useCallback(async (items) => setNavigation(await put('/api/navigation', items)), [put]),
    addNavItem: useCallback(async (data) => setNavigation((p) => [...p, undefined as never]), []),
    updateNavItem: useCallback(async (id, data) => { const u = await put(`/api/navigation/${id}`, data); setNavigation((p) => p.map((n) => n.id === id ? u : n)); }, [put]),
    deleteNavItem: useCallback(async (id) => { await del(`/api/navigation/${id}`); setNavigation((p) => p.filter((n) => n.id !== id)); }, [del]),
    updateHero: useCallback(async (data) => setHeroContent(await put('/api/hero', data)), [put]),
    updateAbout: useCallback(async (data) => setAboutContent(await put('/api/about', data)), [put]),

    addRestaurant: useCallback(async (data) => { const c = await post('/api/restaurants', data); setRestaurants((p) => [...p, c]); }, [post]),
    updateRestaurant: useCallback(async (id, data) => { const u = await put(`/api/restaurants/${id}`, data); setRestaurants((p) => p.map((r) => r.id === id ? u : r)); }, [put]),
    deleteRestaurant: useCallback(async (id) => { await del(`/api/restaurants/${id}`); setRestaurants((p) => p.filter((r) => r.id !== id)); }, [del]),

    addSignatureDish: useCallback(async (data) => { const c = await post('/api/signature-dishes', data); setSignatureDishes((p) => [...p, c]); }, [post]),
    updateSignatureDish: useCallback(async (id, data) => { const u = await put(`/api/signature-dishes/${id}`, data); setSignatureDishes((p) => p.map((d) => d.id === id ? u : d)); }, [put]),
    deleteSignatureDish: useCallback(async (id) => { await del(`/api/signature-dishes/${id}`); setSignatureDishes((p) => p.filter((d) => d.id !== id)); }, [del]),

    addDiningHighlight: useCallback(async (data) => { const c = await post('/api/dining-highlights', data); setDiningHighlights((p) => [...p, c]); }, [post]),
    updateDiningHighlight: useCallback(async (id, data) => { const u = await put(`/api/dining-highlights/${id}`, data); setDiningHighlights((p) => p.map((d) => d.id === id ? u : d)); }, [put]),
    deleteDiningHighlight: useCallback(async (id) => { await del(`/api/dining-highlights/${id}`); setDiningHighlights((p) => p.filter((d) => d.id !== id)); }, [del]),

    addAmenity: useCallback(async (data) => { const c = await post('/api/cms-amenities', data); setAmenities((p) => [...p, c]); }, [post]),
    updateAmenity: useCallback(async (id, data) => { const u = await put(`/api/cms-amenities/${id}`, data); setAmenities((p) => p.map((a) => a.id === id ? u : a)); }, [put]),
    deleteAmenity: useCallback(async (id) => { await del(`/api/cms-amenities/${id}`); setAmenities((p) => p.filter((a) => a.id !== id)); }, [del]),

    updateAvailability: useCallback(async (data) => setAvailabilityContent(await put('/api/availability-content', data)), [put]),

    addContactItem: useCallback(async (data) => { const c = await post('/api/contact', data); setContactItems((p) => [...p, c]); }, [post]),
    updateContactItem: useCallback(async (id, data) => { const u = await put(`/api/contact/${id}`, data); setContactItems((p) => p.map((c) => c.id === id ? u : c)); }, [put]),
    deleteContactItem: useCallback(async (id) => { await del(`/api/contact/${id}`); setContactItems((p) => p.filter((c) => c.id !== id)); }, [del]),

    updateSectionHeaders: useCallback(async (data) => setSectionHeaders(await put('/api/section-headers', data)), [put]),
  };

  // Fix addNavItem to actually call the API
  ctx.addNavItem = useCallback(async (data) => {
    const c = await post('/api/navigation', data);
    setNavigation((p) => [...p, c]);
  }, [post]);

  return (
    <LandingContentContext.Provider value={ctx}>
      {children}
    </LandingContentContext.Provider>
  );
}

export function useLandingContent() {
  const context = useContext(LandingContentContext);
  if (!context) throw new Error('useLandingContent must be used within a LandingContentProvider');
  return context;
}
