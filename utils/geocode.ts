/**
 * Geocoding helpers backed by OpenStreetMap Nominatim.
 *
 * Why Nominatim?
 *  - Free, no API key required
 *  - Accepts real-world addresses (street, city, state, zip)
 *  - Perfect fit for the seed data we ship with the project
 *
 * Usage policy (Nominatim):
 *  - Max 1 request per second
 *  - Provide a descriptive User-Agent / Referer
 *  - Cache results when possible
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'life-world-property-app/1.0 (https://life-world.example)';

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

// In-memory cache: address -> GeocodeResult
// Survives the lifetime of the Node process / browser session.
const cache = new Map<string, GeocodeResult>();

// Track the last request time so we honor the 1 req/sec rate limit.
let lastRequestTime = 0;

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastRequestTime = Date.now();
};

/**
 * Build the full address string from a property's location fields.
 */
export const buildAddress = (location: {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}): string => {
  const parts = [location.street, location.city, location.state, location.zipcode]
    .map((p) => (p ?? '').trim())
    .filter(Boolean);
  return parts.join(', ');
};

/**
 * Geocode a single address. Returns null if no result was found
 * or the request failed. Caches successful and failed lookups.
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  const trimmed = address.trim();
  if (!trimmed) return null;

  // Cache hit (positive OR negative) avoids repeat lookups.
  if (cache.has(trimmed)) {
    return cache.get(trimmed) ?? null;
  }

  await waitForRateLimit();

  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: '1',
      addressdetails: '0',
    });
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        // Some Nominatim mirrors reject empty User-Agents.
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en',
      },
    });
    if (!res.ok) {
      // Cache the failure as null so we don't spam the endpoint.
      cache.set(trimmed, null as unknown as GeocodeResult);
      return null;
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    if (!Array.isArray(data) || data.length === 0) {
      cache.set(trimmed, null as unknown as GeocodeResult);
      return null;
    }
    const first = data[0];
    const result: GeocodeResult = {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      displayName: first.display_name,
    };
    if (Number.isFinite(result.lat) && Number.isFinite(result.lng)) {
      cache.set(trimmed, result);
      return result;
    }
    cache.set(trimmed, null as unknown as GeocodeResult);
    return null;
  } catch {
    return null;
  }
};

/**
 * Geocode a property's location. Falls back to its stored
 * coordinates when geocoding fails (e.g. network errors).
 */
export const resolvePropertyLocation = async (
  property: {
    location?: {
      street?: string;
      city?: string;
      state?: string;
      zipcode?: string;
      coordinates?: { lat: number; lng: number };
    };
  }
): Promise<{ lat: number; lng: number; source: 'geocoded' | 'stored' } | null> => {
  const loc = property.location;
  if (!loc) return null;

  const address = buildAddress(loc);
  if (address) {
    const result = await geocodeAddress(address);
    if (result) {
      return { lat: result.lat, lng: result.lng, source: 'geocoded' };
    }
  }

  // Fallback: use stored coordinates (seeded from city center)
  if (loc.coordinates && Number.isFinite(loc.coordinates.lat) && Number.isFinite(loc.coordinates.lng)) {
    return { lat: loc.coordinates.lat, lng: loc.coordinates.lng, source: 'stored' };
  }

  return null;
};
