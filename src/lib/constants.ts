import type {
  SiteSettings, HeroContent, AboutContent,
  AvailabilityContent, SectionHeaders, DarkThemePresetId,
} from '@/types';

export const DEFAULT_HOTEL_NAME = 'Grand Horizon Hotel & Resort';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: DEFAULT_HOTEL_NAME,
  logo: '',
  favicon: '',
  footerText: '',
  primaryColor: '#c0701f',
  secondaryColor: '#102a43',
  accentColor: '#d4882a',
  backgroundColor: '#f0f4f8',
  darkThemePreset: 'default',
};

export interface DarkThemePreset {
  id: DarkThemePresetId;
  label: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  backgroundColor: string;
}

/** Default dark theme presets. "default" = site default (warm gold on dark). Applies to both public site and admin when dark mode is on. */
export const DARK_THEME_PRESETS: DarkThemePreset[] = [
  { id: 'auto', label: 'Auto', description: 'Derived from theme colors', primary: '', secondary: '', accent: '', backgroundColor: '' },
  { id: 'default', label: 'Default', description: 'Warm gold on dark (site default)', primary: '#c0701f', secondary: '#1a2332', accent: '#a65c1a', backgroundColor: '#0f1923' },
  { id: 'midnight', label: 'Midnight', description: 'Cool blue-black', primary: '#38bdf8', secondary: '#0f172a', accent: '#7dd3fc', backgroundColor: '#020617' },
  { id: 'slate', label: 'Slate', description: 'Neutral gray', primary: '#94a3b8', secondary: '#1e293b', accent: '#cbd5e1', backgroundColor: '#0f172a' },
  { id: 'warm', label: 'Warm', description: 'Amber & brown', primary: '#fbbf24', secondary: '#292524', accent: '#fcd34d', backgroundColor: '#1c1917' },
  { id: 'forest', label: 'Forest', description: 'Dark green', primary: '#4ade80', secondary: '#14532d', accent: '#86efac', backgroundColor: '#052e16' },
  { id: 'navy', label: 'Navy', description: 'Deep blue', primary: '#60a5fa', secondary: '#1e3a8a', accent: '#93c5fd', backgroundColor: '#0c1929' },
];

export const DEFAULT_HERO: HeroContent = {
  badgeText: '',
  heading: '',
  description: '',
  backgroundImage: '',
  primaryButton: { text: '', link: '' },
  secondaryButton: { text: '', link: '' },
  featureHighlights: [],
};

export const DEFAULT_ABOUT: AboutContent = {
  sectionLabel: '',
  title: '',
  description: '',
  images: [],
  stats: [],
};

export const DEFAULT_AVAILABILITY: AvailabilityContent = {
  sectionLabel: '',
  sectionTitle: '',
  description: '',
  bookingNotes: [],
  ctaButtonText: '',
  todayLabel: '',
  legendLabel: '',
  readyTitle: '',
  readyDescription: '',
};

export const DEFAULT_SECTION_HEADERS: SectionHeaders = {
  rooms: { label: '', title: '', description: '' },
  dining: {
    sliderLabel: '', sliderTitle: '',
    label: '', title: '', description: '',
    highlightLabel: '', highlightTitle: '', highlightDescription: '',
  },
  amenities: { label: '', title: '', description: '', backgroundImage: '' },
  contact: { label: '', title: '', description: '' },
};
