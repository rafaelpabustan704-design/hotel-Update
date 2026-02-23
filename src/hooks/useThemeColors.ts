'use client';

import { useEffect } from 'react';
import { adjustBrightness } from '@/utils/colors';
import type { SiteSettings } from '@/types';
import { DARK_THEME_PRESETS } from '@/lib/constants';
import { useTheme } from '@/hooks/ThemeContext';

type DarkColors = { primary: string; secondary: string; accent: string; backgroundColor: string };

/** Returns CSS variable key-value pairs for dark mode (so we can set them on root when theme is dark). */
function getDarkVarValues(settings: SiteSettings): Record<string, string> {
  const presetId = settings.darkThemePreset ?? 'default';
  const preset = DARK_THEME_PRESETS.find((p) => p.id === presetId);
  const c: DarkColors =
    preset?.id === 'auto' || !preset
      ? {
          primary: settings.primaryColor ? adjustBrightness(settings.primaryColor, 25) : '',
          accent: settings.accentColor ? adjustBrightness(settings.accentColor, 10) : '',
          secondary: settings.secondaryColor ? adjustBrightness(settings.secondaryColor, -15) : '',
          backgroundColor: settings.backgroundColor ? adjustBrightness(settings.backgroundColor, -70) : '',
        }
      : {
          primary: preset.primary,
          secondary: preset.secondary,
          accent: preset.accent,
          backgroundColor: preset.backgroundColor,
        };

  const out: Record<string, string> = {};
  if (c.primary) {
    out['--color-gold-600'] = c.primary;
    out['--color-gold-500'] = adjustBrightness(c.primary, 15);
    out['--color-gold-700'] = adjustBrightness(c.primary, -15);
    out['--color-gold-400'] = adjustBrightness(c.primary, 35);
    out['--color-gold-300'] = adjustBrightness(c.primary, 55);
    out['--color-gold-100'] = adjustBrightness(c.primary, 85);
    out['--color-gold-50'] = adjustBrightness(c.primary, 92);
  }
  if (c.accent) {
    out['--color-gold-800'] = adjustBrightness(c.accent, -25);
    out['--color-gold-900'] = adjustBrightness(c.accent, -40);
  }
  if (c.secondary) {
    out['--color-hotel-900'] = c.secondary;
    out['--color-hotel-800'] = adjustBrightness(c.secondary, 10);
  }
  if (c.backgroundColor) {
    out['--color-hotel-50'] = c.backgroundColor;
  }
  return out;
}

export function useThemeColors(settings: SiteSettings) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const oldStyle = document.getElementById('theme-dark-overrides');
    if (oldStyle) oldStyle.remove();

    if (theme === 'dark') {
      const darkVars = getDarkVarValues(settings);
      Object.entries(darkVars).forEach(([key, value]) => root.style.setProperty(key, value));
      return;
    }

    // Light theme: set light vars on root
    if (settings.primaryColor) {
      root.style.setProperty('--color-gold-600', settings.primaryColor);
      root.style.setProperty('--color-gold-500', adjustBrightness(settings.primaryColor, 15));
      root.style.setProperty('--color-gold-700', adjustBrightness(settings.primaryColor, -15));
      root.style.setProperty('--color-gold-400', adjustBrightness(settings.primaryColor, 35));
      root.style.setProperty('--color-gold-300', adjustBrightness(settings.primaryColor, 55));
      root.style.setProperty('--color-gold-100', adjustBrightness(settings.primaryColor, 85));
      root.style.setProperty('--color-gold-50', adjustBrightness(settings.primaryColor, 92));
    }
    if (settings.accentColor) {
      root.style.setProperty('--color-gold-800', adjustBrightness(settings.accentColor, -25));
      root.style.setProperty('--color-gold-900', adjustBrightness(settings.accentColor, -40));
    }
    if (settings.secondaryColor) {
      root.style.setProperty('--color-hotel-900', settings.secondaryColor);
      root.style.setProperty('--color-hotel-800', adjustBrightness(settings.secondaryColor, 10));
    }
    if (settings.backgroundColor) {
      root.style.setProperty('--color-hotel-50', settings.backgroundColor);
    }
  }, [settings, theme]);
}
