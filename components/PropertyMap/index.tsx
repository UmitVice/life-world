"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { IProperty } from '@/models/Property';
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
  const [center, setCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const mapRef = useRef<{
    flyTo: (latlng: [number, number], zoom?: number) => void;
  } | null>(null);

  const containerHeight = height ?? (mode === 'single' ? 400 : 500);

  useEffect(() => {
    setIsClient(true);

    // Leaflet's default marker icons do not load correctly in Next.js —
    // patch them with inline SVG data URIs (no file copying required).
    void (async () => {
      const L = await import('leaflet');
      const proto = L.Icon.Default.prototype as unknown as {
        _getIconUrl?: unknown;
      };
      delete proto._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMEM1LjU5NyAwIDAgNS41OTcgMCAxMi41YzAgNi41IDEyLjUgMjguNSAxMi41IDI4LjVTMjUgMTkgMjUgMTIuNUMyNSA1LjU5NyAxOS40MDQgMCAxMi41IDB6IiBmaWxsPSIjMGI4MTNjIi8+PGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMEM1LjU5NyAwIDAgNS41OTcgMCAxMi41YzAgNi41IDEyLjUgMjguNSAxMi41IDI4LjVTMjUgMTkgMjUgMTIuNUMyNSA1LjU5NyAxOS40MDQgMCAxMi41IDB6IiBmaWxsPSIjMGI4MTNjIi8+PGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        shadowUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MSIgaGVpZ2h0PSI0MSIvPg==',
      });
    })();
  }, []);

  // First pass: render everything we can with stored coordinates
  // (instant, no network) so the user sees markers right away.
  useEffect(() => {
    if (!isClient) return;

    const initial: ResolvedProperty[] = [];
    for (const property of properties) {
      const coords = property.location?.coordinates;
      if (
        coords &&
        Number.isFinite(coords.lat) &&
        Number.isFinite(coords.lng)
      ) {
        initial.push({
          property,
          address: buildAddress(property.location ?? {}),
          lat: coords.lat,
          lng: coords.lng,
          source: 'stored',
        });
      }
    }
    setResolved(initial);

    if (initial.length > 0) {
      setCenter([initial[0].lat, initial[0].lng]);
    }
  }, [isClient, properties]);

  // Second pass: progressively resolve any property still missing
  // coordinates. We kick off the requests on mount and as `properties`
  // changes, but never re-fire for an id that's already in `resolved`.
  useEffect(() => {
    if (!isClient || properties.length === 0) return;

    const pending: IProperty[] = [];
    for (const property of properties) {
      const id = property._id?.toString() ?? '';
      if (!id) continue;
      const coords = property.location?.coordinates;
      const hasStored =
        coords &&
        Number.isFinite(coords.lat) &&
        Number.isFinite(coords.lng);
      if (hasStored) continue;
      // If we already have a row for this id (e.g. from a prior
      // geocode), don't re-resolve.
      if (resolved.some((r) => r.property._id?.toString() === id)) continue;
      pending.push(property);
    }

    if (pending.length === 0) return;

    let cancelled = false;

    (async () => {
      for (const property of pending) {
        if (cancelled) return;
        const id = property._id?.toString() ?? '';
        // Try real geocoding first (rate-limited inside the helper).
        setLoadingAddresses((prev) => new Set(prev).add(id));
        const result = await resolvePropertyLocation(property);
        if (cancelled) return;

        let next: ResolvedProperty | null = null;
        if (result) {
          next = {
            property,
            address: buildAddress(property.location ?? {}),
            lat: result.lat,
            lng: result.lng,
            source: result.source,
          };
        } else {
          // Last-resort: drop a marker at the known city center so
          // users at least see something in the right region.
          const center = fallbackCenter(property);
          if (center) {
            next = {
              property,
              address: buildAddress(property.location ?? {}),
              lat: center[0],
              lng: center[1],
              source: 'stored',
            };
          }
        }

        if (next) {
          setResolved((prev) => {
            // Avoid duplicates in case the user toggles view quickly.
            if (prev.some((r) => r.property._id?.toString() === id)) {
              return prev;
            }
            return [...prev, next];
          });
        }

        setLoadingAddresses((prev) => {
          const nextSet = new Set(prev);
          nextSet.delete(id);
          return nextSet;
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isClient, properties, resolved]);

  // When the user clicks a marker that is still on a stored (rough)
  // coordinate, geocode the address and re-center the map on the
  // exact location. Honors Nominatim's 1 req/sec rate limit via the
  // cache inside geocodeAddress.
  const handleMarkerClick = useCallback(
    async (item: ResolvedProperty) => {
      if (item.source === 'geocoded' || !item.address) return;
      const propertyId = item.property._id?.toString() ?? '';
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
    // In 'list' mode we may still be geocoding in the background; show
    // a friendlier message that doesn't pretend the data is missing.
    const inFlight = loadingAddresses.size > 0;
    return (
      <div
        className={`w-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 ${
          className ?? ''
        }`}
        style={{ height: containerHeight }}
      >
        {inFlight
          ? `Resolving ${loadingAddresses.size} location${
              loadingAddresses.size === 1 ? '' : 's'
            }...`
          : 'No properties with location data available to display on the map.'}
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
        zoom={mode === 'single' ? 13 : resolved.length > 1 ? 4 : 13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        ref={(map: {
          flyTo: (latlng: [number, number], zoom?: number) => void;
        } | null) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {resolved.map((item) => {
          const isLoading = loadingAddresses.has(
            item.property._id?.toString() ?? ''
          );
          return (
            <Marker
              key={item.property._id}
              position={[item.lat, item.lng]}
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
