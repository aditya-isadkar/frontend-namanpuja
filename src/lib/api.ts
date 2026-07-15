import type { City, Country, Puja, PujaLocation, Temple } from './types';

// On the server (SSR/SSG/Docker), prefer API_INTERNAL_URL so the container can
// reach the backend over the internal network (e.g. http://backend:4000/api).
// In the browser, always use the public NEXT_PUBLIC_API_URL. Falls back cleanly
// when API_INTERNAL_URL isn't set (e.g. on Vercel), so this is production-safe.
const API_URL =
  (typeof window === 'undefined'
    ? process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) ?? 'http://localhost:4000/api';

interface FetchOpts {
  /** ISR revalidate seconds (server components). */
  revalidate?: number;
}

async function api<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: opts.revalidate ?? 300 },
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Safe variant — returns a fallback instead of throwing (useful when the API is down). */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export const getCountries = () => safe(api<Country[]>('/countries'), []);

export const getCountryCities = (slug: string) =>
  safe(api<{ country: Country; cities: City[] }>(`/countries/${slug}/cities`), {
    country: { id: '', name: '', slug },
    cities: [],
  });

export const getCity = (slug: string) =>
  safe(api<{ city: City; locations: PujaLocation[]; temples: Temple[] }>(`/cities/${slug}`), {
    city: { id: '', name: '', slug },
    locations: [],
    temples: [],
  });

export const getPujas = () => safe(api<Puja[]>('/pujas'), []);
export const getPuja = (slug: string) => api<Puja>(`/pujas/${slug}`);

export const getLocation = (slug: string) => api<PujaLocation>(`/locations/${slug}`);
export const getAllLocationSlugs = () =>
  safe(api<{ slug: string; updatedAt: string }[]>('/locations'), []);

export const getTemples = () => safe(api<Temple[]>('/temples'), []);
export const getTemple = (slug: string) => api<Temple>(`/temples/${slug}`);

export interface BookingPayload {
  serviceType: 'EPUJA' | 'HOME_VISIT' | 'BOTH';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  preferredDate?: string;
  preferredTime?: string;
  addressLine?: string;
  pincode?: string;
  pujaId?: string;
  cityId?: string;
  userId?: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  phone: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || 'Registration failed');
  return data as AuthResponse;
}

export async function login(payload: { email: string; password?: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || 'Login failed');
  return data as AuthResponse;
}

export async function getMe(token: string): Promise<AuthResponse['user']> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch user');
  return data as AuthResponse['user'];
}

export async function createBooking(payload: BookingPayload) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? data?.message ?? 'Booking failed');
  return data as { reference: string; status: string; message: string };
}
export const getAllCitiesWithCountry = async () => {
  const countries = await getCountries();
  const results = await Promise.all(
    countries.map((c) => getCountryCities(c.slug)),
  );
  return results.flatMap((r) =>
    r.cities.map((city) => ({ ...city, country: r.country })),
  );
};

export { API_URL };
