"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { IProperty } from '@/models/Property';

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

const getPriceForDisplay = (property: IProperty): number => {
  if (property.rates?.monthly) return property.rates.monthly;
  if (property.rates?.weekly) return property.rates.weekly;
  if (property.rates?.nightly) return property.rates.nightly;
  return 0;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
  const [isClient, setIsClient] = useState(false);

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

  if (!isClient) {
    return (
      <div className="h-[500px] w-full bg-gray-200 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg">
        Loading Map...
      </div>
    );
  }

  // Filter properties with valid coordinates
  const validProperties = properties.filter(
    (p) =>
      p.location?.coordinates &&
      typeof p.location.coordinates.lat === 'number' &&
      typeof p.location.coordinates.lng === 'number'
  );

  if (validProperties.length === 0) {
    return (
      <div className="h-[500px] w-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700">
        No properties with location data available to display on the map.
      </div>
    );
  }

  // Use the first valid coordinate as the map center
  const firstCoords = validProperties[0].location.coordinates!;
  const defaultCenter: [number, number] = [firstCoords.lat, firstCoords.lng];

  return (
    <div className="h-[500px] w-full rounded-lg shadow-inner overflow-hidden border border-slate-300 dark:border-slate-700">
      <MapContainer
        center={defaultCenter}
        zoom={validProperties.length > 1 ? 6 : 13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProperties.map((property) => {
          const coords = property.location.coordinates!;
          return (
            <Marker key={property._id} position={[coords.lat, coords.lng]}>
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <h3 className="font-bold text-sm">{property.name}</h3>
                  <p className="text-xs text-slate-600">
                    {property.location?.city}, {property.location?.state}
                  </p>
                  <p className="text-sm font-semibold text-emerald-700 mt-1">
                    ${getPriceForDisplay(property).toLocaleString()}
                  </p>
                  <a
                    href={`/properties/${property._id}`}
                    className="text-xs text-blue-600 hover:underline"
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
