/**
 * Resolves template placeholders in CMS text.
 *
 * Supported placeholders:
 *   {{hotelName}}      - Full site name (e.g. "Lovely Hotel & Resort")
 *   {{hotelShortName}} - First two words (e.g. "Lovely Hotel")
 */
export function resolveTemplate(text: string, hotelName: string): string {
  if (!text) return text;
  const shortName = hotelName.split(' ').slice(0, 2).join(' ');
  return text
    .replace(/\{\{hotelName\}\}/g, hotelName)
    .replace(/\{\{hotelShortName\}\}/g, shortName);
}
