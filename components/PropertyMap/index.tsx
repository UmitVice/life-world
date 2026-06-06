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
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
) as any;

interface PropertyMapProps {
  properties: IProperty[];
}

interface ResolvedProperty {
  property: IProperty;
  address: string;
  lat: number;
  lng: number;
  source: 'geocoded' | 'stored';
}

const getPriceForDisplay = (property: IProperty): number => {
  if (property.rates?.monthly) return property.rates.monthly;
  if (property.rates?.weekly) return property.rates.weekly;
  if (property.rates?.nightly) return property.rates.nightly;
  return 0;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
  const [isClient, setIsClient] = useState(false);
  const [resolved, setResolved] = useState<ResolvedProperty[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<Set<string>>(new Set());
  const [center, setCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const mapRef = useRef<{ flyTo: (latlng: [number, number], zoom?: number) => void } | null>(null);

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

  // Initial pass: use stored coordinates (fast, no network).
  useEffect(() => {
    if (!isClient) return;

    const initial: ResolvedProperty[] = [];
    for (const property of properties) {
      const coords = property.location?.coordinates;
      if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
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

  // When user clicks a marker, geocode the actual address and
  // pan the map to the exact location. Honors Nominatim's
  // 1 req/sec rate limit via the cache inside geocodeAddress.
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
      <div className="h-[500px] w-full bg-gray-200 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg">
        Loading Map...
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="h-[500px] w-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
        No properties with location data available to display on the map.
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full rounded-lg shadow-inner overflow-hidden border border-slate-300 dark:border-slate-700">
      <MapContainer
        center={center}
        zoom={resolved.length > 1 ? 4 : 13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        ref={(map: { flyTo: (latlng: [number, number], zoom?: number) => void } | null) => {
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
                  <h3 className="font-bold text-sm mb-1">{item.property.name}</h3>
                  <p className="text-xs text-slate-700 mb-1">
                    📍 {item.address || `${item.property.location?.city}, ${item.property.location?.state}`}
                  </p>
                  {item.source === 'stored' && (
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
                    <p className="text-[10px] text-emerald-600">✓ Exact location</p>
                  )}
                  <p className="text-sm font-semibold text-emerald-700 mt-2">
                    ${getPriceForDisplay(item.property).toLocaleString()}
                  </p>
                  <a
                    href={`/properties/${item.property._id}`}
                    className="text-xs text-blue-600 hover:underline block mt-1"
                  >
                    View details →
                  </a>
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
