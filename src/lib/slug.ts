/**
 * Client-side / SSR slug utilities.
 * Generates identical slugs to the backend's slug.ts.
 */

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word/space/hyphen characters
    .replace(/[\s_]+/g, '-')  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

/** Build the canonical puja-in-city slug, e.g. "satyanarayan-puja-in-varanasi-uttar-pradesh". */
export function pujaLocationSlug(pujaName: string, cityName: string, state?: string | null): string {
  const parts = [pujaName, 'in', cityName, state ?? ''].filter(Boolean).join(' ');
  return toSlug(parts);
}
