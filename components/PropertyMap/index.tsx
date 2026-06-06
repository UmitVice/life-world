"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { IProperty } from '@/models/Property';
import { resolvePropertyLocation, buildAddress } from '@/utils/geocode';

// Load each react-leaflet component via a separate dynamic import.
// Note: an `any` cast is required because the dynamic import's return type
// is incompatible with React's typing (react-leaflet@5 is ESM-only, so
// type inference is incomplete).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

type Source = 'geocoded' | 'stored';

interface ResolvedProperty {
  property: IProperty;
  address: string;
  lat: number;
  lng: number;
  source: Source;
  /** true while a geocode call is in flight for this row. */
  pending?: boolean;
}

interface PropertyMapProps {
  properties: IProperty[];
  /**
   * 'list' shows all properties as markers (used on /properties).
   * 'single' shows one focused property and re-geocodes eagerly.
   * Default: 'list'.
   */
  mode?: 'list' | 'single';
  /**
   * Optional height override. Defaults to 500px for the list view and
   * 400px for the single-property view (matches the old MapDisplay
   * placeholder).
   */
  height?: number;
  className?: string;
}

const getPriceForDisplay = (property: IProperty): number => {
  if (property.rates?.monthly) return property.rates.monthly;
  if (property.rates?.weekly) return property.rates.weekly;
  if (property.rates?.nightly) return property.rates.nightly;
  return 0;
};

// US city centers used as a last-resort fallback when a property is missing
// both stored coordinates AND a successful geocode. The seed data is
// concentrated in these cities, so we keep a small lookup table to avoid
// burning the Nominatim rate limit on every miss.
const CITY_CENTERS: Record<string, [number, number]> = {
  'New York':     [40.7128, -74.0060],
  'Los Angeles':  [34.0522, -118.2437],
  'Chicago':      [41.8781, -87.6298],
  'Houston':      [29.7604, -95.3690],
  'Phoenix':      [33.4484, -112.0740],
  'Philadelphia': [39.9526, -75.1652],
  'San Antonio':  [29.4241, -98.4936],
  'San Diego':    [32.7157, -117.1611],
  'Dallas':       [32.7767, -96.7970],
  'San Jose':     [37.3382, -121.8863],
};

const fallbackCenter = (property: IProperty): [number, number] | null => {
  const city = property.location?.city;
  if (city && CITY_CENTERS[city]) return CITY_CENTERS[city];
  return null;
};

// ---------------------------------------------------------------------
// Custom divIcon (round avatar + always-visible address label)
// ---------------------------------------------------------------------
// We render the marker as a divIcon (HTML, not an image) so we can put
// the property's photo inside a circle plus a small text label with
// the street address. CSS for this lives in assets/styles/globals.css
// under `.custom-property-marker`.

const MARKER_AVATAR_SIZE = 48; // px
const MARKER_LABEL_HEIGHT = 18; // px
const MARKER_GAP = 4; // px between avatar and label
const MARKER_TOTAL_HEIGHT =
  MARKER_AVATAR_SIZE + MARKER_GAP + MARKER_LABEL_HEIGHT;
// We give the clickable area a little extra width so users can click the
// label without aiming at the avatar.
const MARKER_WIDTH = 120;

/**
 * Build the marker avatar URL. We prefer the pre-generated 96×96 WebP
 * under `marker/<name>.webp` (small, sharp on retina) and fall back
 * to the original `.jpg` if the optimized variant is missing.
 */
const buildMarkerImageSrc = (property: IProperty): string => {
  const first = property.images?.[0];
  if (!first) return '/images/properties/marker/placeholder.webp';
  // If the value is already an absolute URL or starts with `/`, use as-is.
  if (/^(https?:)?\/\//i.test(first) || first.startsWith('/')) return first;
  // `image` in seed is e.g. "a1.jpg". Strip the extension and
  // append .webp — the optimize-images script generates the variant.
  const baseName = first.replace(/\.(jpe?g|png)$/i, '');
  return `/images/properties/marker/${baseName}.webp`;
};

const buildAddressLabel = (property: IProperty): string => {
  // Prefer the street (most specific) → fall back to city → empty.
  const loc = property.location;
  if (loc?.street) return loc.street;
  if (loc?.city) return `${loc.city}${loc.state ? `, ${loc.state}` : ''}`;
  return '';
};

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    c === '&' ? '&' :
    c === '<' ? '<' :
    c === '>' ? '>' :
    c === '"' ? '"' :
    '&#39;'
  );

const createPropertyIcon = (
  property: IProperty,
  isActive: boolean,
): unknown => {
  // Dynamic import inside the function so it never runs during SSR
  // (Leaflet touches `window`). The first call will pay the cost; the
  // icon cache below memoizes the result.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const L = require('leaflet');

  const imageSrc = buildMarkerImageSrc(property);
  const address = buildAddressLabel(property);
  const safeAddress = escapeHtml(address);
  const safeName = escapeHtml(property.name ?? 'Property');

  const html = `
    <div class="marker-stack" data-property-id="${escapeHtml(
      property._id?.toString() ?? '',
    )}">
      <div class="marker-avatar" aria-hidden="true">
        <img src="${escapeHtml(imageSrc)}" alt="${safeName}" loading="eager"
             onerror="this.onerror=null;this.src='${escapeHtml(
               imageSrc.replace('/marker/', '/').replace('.webp', '.jpg'),
             )}'" />
      </div>
      ${
        safeAddress
          ? `<div class="marker-label" title="${safeAddress}">${safeAddress}</div>`
          : ''
      }
    </div>
  `.trim();

  return L.divIcon({
    className: `custom-property-marker${isActive ? ' is-active' : ''}`,
    html,
    // iconSize is the bounding box of the clickable area. We match the
    // visible avatar + label so clicking anywhere on the icon works.
    iconSize: [MARKER_WIDTH, MARKER_TOTAL_HEIGHT],
    // iconAnchor is the tip of the marker — where Leaflet places the
    // geographic coordinate. We anchor at the bottom-center of the
    // avatar so the pin "stands" on the location.
    iconAnchor: [MARKER_WIDTH / 2, MARKER_TOTAL_HEIGHT],
    // popupAnchor offsets the popup relative to iconAnchor. We open
    // the popup just above the avatar.
    popupAnchor: [0, -MARKER_TOTAL_HEIGHT],
  });
};

// Per-property memoization so React re-renders don't allocate a new
// divIcon on every keystroke during a filter change.
const iconCache = new Map<string, { base: unknown; active: unknown }>();

const getPropertyIcon = (property: IProperty, isActive: boolean): unknown => {
  const id = property._id?.toString() ?? property.name;
  let entry = iconCache.get(id);
  if (!entry) {
    entry = { base: createPropertyIcon(property, false), active: null };
    iconCache.set(id, entry);
  }
  if (isActive) {
    if (!entry.active) entry.active = createPropertyIcon(property, true);
    return entry.active;
  }
  return entry.base;
};

// The map instance exposes more than what react-leaflet types declare.
// We type it loosely so we can call fitBounds/panBy etc. when needed.
type MapInstance = {
  flyTo: (latlng: [number, number], zoom?: number) => void;
  fitBounds: (
    bounds: [[number, number], [number, number]],
    options?: { padding?: [number, number]; maxZoom?: number; animate?: boolean }
  ) => void;
  invalidateSize: () => void;
};

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  mode = 'list',
  height,
  className,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [resolved, setResolved] = useState<ResolvedProperty[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<Set<string>>(
    new Set()
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  // Default to a US-wide view so the map shows something useful while
  // we wait for geocoding. Once we have markers we call fitBounds to
  // zoom in to the actual data.
  const [center, setCenter] = useState<[number, number]>([39.8283, -98.5795]);
  // Increments once when the map is mounted; the fitBounds effect
  // depends on it so it can run even if `resolved` doesn't change.
  const [mapInstanceTick, setMapInstanceTick] = useState(0);
  const mapRef = useRef<MapInstance | null>(null);
  // Guard so we only call fitBounds the first time we have markers
  // AND the map is mounted. Subsequent re-renders (filters, popups)
  // shouldn't yank the user's view around.
  const hasFitBoundsRef = useRef(false);

  const containerHeight = height ?? (mode === 'single' ? 400 : 500);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ---- Single synchronous resolution pass ---------------------------
  // We resolve every property to a (lat, lng) IMMEDIATELY in a single
  // pass: stored coordinates first, then the local CITY_CENTERS
  // lookup as a deterministic offline fallback. This means the map
  // can render all 12 markers on the first paint with no network
  // round-trips — important because Nominatim enforces 1 req/sec
  // and we don't want users to wait 12s before seeing anything.
  //
  // Real geocoding (Nominatim) only runs on demand, when the user
  // clicks "Show exact location" in a popup, see handleMarkerClick.
  useEffect(() => {
    if (!isClient) return;

    const initial: ResolvedProperty[] = [];
    for (const property of properties) {
      const coords = property.location?.coordinates;
      let lat: number | undefined;
      let lng: number | undefined;
      let source: Source = 'stored';

      if (
        coords &&
        Number.isFinite(coords.lat) &&
        Number.isFinite(coords.lng)
      ) {
        lat = coords.lat;
        lng = coords.lng;
      } else {
        const city = fallbackCenter(property);
        if (city) {
          lat = city[0];
          lng = city[1];
        }
      }

      if (lat === undefined || lng === undefined) continue;
      initial.push({
        property,
        address: buildAddress(property.location ?? {}),
        lat,
        lng,
        source,
      });
    }
    setResolved(initial);

    if (initial.length > 0) {
      setCenter([initial[0].lat, initial[0].lng]);
    }
  }, [isClient, properties]);

  // Once we have at least one marker and the map is mounted, call
  // fitBounds to auto-frame all markers. We only do this once per
  // component instance so user interactions (clicks, scroll) are
  // not undone by background geocoding updates. We depend on
  // `mapInstanceTick` (a counter that increments exactly once when
  // the map's ref fires) instead of mutating a ref-based guard inside
  // an effect — that pattern caused an infinite render loop earlier.
  useEffect(() => {
    if (hasFitBoundsRef.current) return;
    if (resolved.length === 0) return;
    if (mapInstanceTick === 0) return;
    const map = mapRef.current;
    if (!map) return;

    if (mode === 'single') {
      // Single-property: zoom in tight on that one point.
      map.flyTo([resolved[0].lat, resolved[0].lng], 14);
      hasFitBoundsRef.current = true;
      return;
    }

    // Multi-property: compute a bounding box and fit.
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const r of resolved) {
      if (r.lat < minLat) minLat = r.lat;
      if (r.lat > maxLat) maxLat = r.lat;
      if (r.lng < minLng) minLng = r.lng;
      if (r.lng > maxLng) maxLng = r.lng;
    }
    if (!Number.isFinite(minLat)) return;
    map.fitBounds(
      [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
      { padding: [40, 40], maxZoom: 14, animate: true }
    );
    hasFitBoundsRef.current = true;
  }, [resolved, mode, mapInstanceTick]);

  // Stable ref callback. We store the map instance in a ref AND bump
  // a counter (so the fitBounds effect re-runs). No `setState` is
  // called inside the callback that depends on the previous state —
  // that's the pattern that caused an infinite loop earlier.
  const handleMapRef = useCallback((map: MapInstance | null) => {
    if (map && map !== mapRef.current) {
      mapRef.current = map;
      // Schedule invalidateSize for after the container has had a
      // chance to measure itself. The state bump happens once,
      // synchronously, so the fitBounds effect can run on the next
      // render.
      setMapInstanceTick((t) => t + 1);
      // Defer size invalidation to the next animation frame so the
      // tile layer is guaranteed to be mounted.
      requestAnimationFrame(() => {
        try {
          map.invalidateSize();
        } catch {
          // ignore — invalidateSize can throw if the map was
          // destroyed mid-frame (e.g. parent unmounted).
        }
      });
    } else if (!map) {
      mapRef.current = null;
    }
  }, []);

  // When the user clicks a marker that is still on a stored (rough)
  // coordinate, geocode the address via Nominatim and re-center the
  // map on the exact location. Honors Nominatim's 1 req/sec rate
  // limit via the cache inside geocodeAddress.
  const handleMarkerClick = useCallback(
    async (item: ResolvedProperty) => {
      const propertyId = item.property._id?.toString() ?? '';
      setActiveId(propertyId);

      if (item.source === 'geocoded' || !item.address) return;
      if (loadingAddresses.has(propertyId)) return;
      setLoadingAddresses((prev) => new Set(prev).add(propertyId));

      const result = await resolvePropertyLocation(item.property);
      if (result) {
        setResolved((prev) =>
          prev.map((r) =>
            r.property._id?.toString() === propertyId
              ? { ...r, lat: result.lat, lng: result.lng, source: result.source }
              : r
          )
        );
        setCenter([result.lat, result.lng]);
        // Smoothly animate the map to the geocoded location
        mapRef.current?.flyTo([result.lat, result.lng], 15);
      }

      setLoadingAddresses((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    },
    [loadingAddresses]
  );

  // Memoize the marker list so React doesn't re-allocate icons on
  // every parent re-render.
  const markerList = useMemo(
    () =>
      resolved.map((item) => {
        const id = item.property._id?.toString() ?? '';
        return { item, id };
      }),
    [resolved]
  );

  if (!isClient) {
    return (
      <div
        className={`w-full bg-gray-200 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg ${
          className ?? ''
        }`}
        style={{ height: containerHeight }}
      >
        Loading Map...
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div
        className={`w-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 ${
          className ?? ''
        }`}
        style={{ height: containerHeight }}
      >
        No properties with location data available to display on the map.
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-lg shadow-inner overflow-hidden border border-slate-300 dark:border-slate-700 ${
        className ?? ''
      }`}
      style={{ height: containerHeight }}
    >
      <MapContainer
        center={center}
        zoom={mode === 'single' ? 13 : 4}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        ref={handleMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerList.map(({ item, id }) => {
          const isLoading = loadingAddresses.has(id);
          const isActive = activeId === id;
          return (
            <Marker
              key={id || item.property.name}
              position={[item.lat, item.lng]}
              icon={getPropertyIcon(item.property, isActive) as never}
              eventHandlers={{
                click: () => handleMarkerClick(item),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">
                    {item.property.name}
                  </h3>
                  <p className="text-xs text-slate-700 mb-1">
                    📍{' '}
                    {item.address ||
                      `${item.property.location?.city}, ${item.property.location?.state}`}
                  </p>
                  {item.source === 'stored' && mode === 'list' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void handleMarkerClick(item);
                      }}
                      disabled={isLoading}
                      className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {isLoading ? 'Resolving...' : 'Show exact location'}
                    </button>
                  )}
                  {item.source === 'geocoded' && (
                    <p className="text-[10px] text-emerald-600">
                      ✓ Exact location
                    </p>
                  )}
                  <p className="text-sm font-semibold text-emerald-700 mt-2">
                    ${getPriceForDisplay(item.property).toLocaleString()}
                  </p>
                  {mode === 'list' && (
                    <a
                      href={`/properties/${item.property._id}`}
                      className="text-xs text-blue-600 hover:underline block mt-1"
                    >
                      View details →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
