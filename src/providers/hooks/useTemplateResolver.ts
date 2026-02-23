'use client';

import { useCallback } from 'react';
import { useLandingContent } from '@/hooks/LandingContentContext';
import { resolveTemplate } from '@/utils/template';

/**
 * Returns a `t()` function that resolves {{hotelName}} / {{hotelShortName}}
 * placeholders using the current siteSettings.name.
 */
export function useTemplateResolver() {
  const { siteSettings } = useLandingContent();
  const hotelName = siteSettings.name || 'Grand Horizon Hotel & Resort';

  return useCallback(
    (text: string) => resolveTemplate(text, hotelName),
    [hotelName],
  );
}
