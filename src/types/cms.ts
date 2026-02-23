/** Dark mode theme preset id. When set, dark mode uses this preset instead of auto-derived colors. */
export type DarkThemePresetId = 'auto' | 'default' | 'midnight' | 'slate' | 'warm' | 'forest' | 'navy';

export interface SiteSettings {
  name: string;
  logo: string;
  favicon: string;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  /** Dark mode: 'auto' (derive from theme colors) or a preset id. */
  darkThemePreset?: DarkThemePresetId;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroButton {
  text: string;
  link: string;
}

export interface HeroFeatureHighlight {
  icon: string;
  label: string;
}

export interface HeroContent {
  badgeText: string;
  heading: string;
  description: string;
  backgroundImage: string;
  primaryButton: HeroButton;
  secondaryButton: HeroButton;
  featureHighlights: HeroFeatureHighlight[];
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutStat {
  icon: string;
  label: string;
  value: string;
}

export interface AboutContent {
  sectionLabel: string;
  title: string;
  description: string;
  images: AboutImage[];
  stats: AboutStat[];
}

export interface RestaurantItem {
  id: string;
  name: string;
  cuisine: string;
  hours: string;
  description: string;
  image: string;
  tags: string[];
  buttonText: string;
}

export interface SignatureDish {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface DiningHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AmenityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AvailabilityContent {
  sectionLabel: string;
  sectionTitle: string;
  description: string;
  bookingNotes: string[];
  ctaButtonText: string;
  todayLabel: string;
  legendLabel: string;
  readyTitle: string;
  readyDescription: string;
}

export interface ContactItem {
  id: string;
  icon: string;
  title: string;
  lines: string[];
}

export interface SectionHeaderGroup {
  label: string;
  title: string;
  description: string;
}

export interface DiningSectionHeaders {
  sliderLabel: string;
  sliderTitle: string;
  label: string;
  title: string;
  description: string;
  highlightLabel: string;
  highlightTitle: string;
  highlightDescription: string;
}

export interface AmenitiesSectionHeaders extends SectionHeaderGroup {
  backgroundImage: string;
}

export interface SectionHeaders {
  rooms: SectionHeaderGroup;
  dining: DiningSectionHeaders;
  amenities: AmenitiesSectionHeaders;
  contact: SectionHeaderGroup;
}
