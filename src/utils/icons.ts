import {
  Award, Bath, BedDouble, Briefcase, CakeSlice, CalendarCheck,
  Car, ChefHat, Clock, Coffee, CreditCard, Dumbbell, Eye,
  Fence, Flame, Gem, Leaf, Lock, Mail, MapPin, Maximize,
  Phone, Refrigerator, Ruler, ShieldCheck, Snowflake, Sofa,
  Sparkles, Star, Tv, UserCheck, Users, UtensilsCrossed,
  Waves, Wifi, Wine,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Bath, BedDouble, Briefcase, CakeSlice, CalendarCheck,
  Car, ChefHat, Clock, Coffee, CreditCard, Dumbbell, Eye,
  Fence, Flame, Gem, Leaf, Lock, Mail, MapPin, Maximize,
  Phone, Refrigerator, Ruler, ShieldCheck, Snowflake, Sofa,
  Sparkles, Star, Tv, UserCheck, Users, UtensilsCrossed,
  Waves, Wifi, Wine,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Star;
}

const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export type IconCategory = 'amenities' | 'contact' | 'dining' | 'hero' | 'about';

const SUGGESTED: Record<IconCategory, string[]> = {
  amenities: [
    'Wifi', 'Waves', 'Dumbbell', 'Car', 'Coffee', 'Tv', 'Bath',
    'Snowflake', 'Sofa', 'Sparkles', 'Lock', 'Leaf', 'BedDouble',
    'UtensilsCrossed', 'Wine', 'Refrigerator',
  ],
  contact: [
    'Phone', 'Mail', 'MapPin', 'Clock', 'Users', 'CalendarCheck',
    'Briefcase',
  ],
  dining: [
    'UtensilsCrossed', 'ChefHat', 'CakeSlice', 'Wine', 'Coffee',
    'Flame', 'Star', 'Award', 'Gem', 'Leaf', 'ShieldCheck',
  ],
  hero: [
    'ShieldCheck', 'Award', 'CreditCard', 'CalendarCheck', 'Star',
    'Sparkles', 'Gem', 'UserCheck',
  ],
  about: [
    'Award', 'Star', 'Users', 'BedDouble', 'CalendarCheck', 'Gem',
    'Sparkles', 'ShieldCheck', 'Clock',
  ],
};

/**
 * Returns icons ordered by relevance for a given category.
 * Suggested icons come first, then all remaining icons.
 */
export function getIconsForCategory(category: IconCategory): string[] {
  const suggested = SUGGESTED[category] ?? [];
  const rest = AVAILABLE_ICONS.filter((ic) => !suggested.includes(ic));
  return [...suggested, ...rest];
}

export function getSuggestedIcons(category: IconCategory): string[] {
  return SUGGESTED[category] ?? [];
}
