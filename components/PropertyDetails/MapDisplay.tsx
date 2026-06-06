import { IProperty } from '@/models/Property';
import PropertyMap from '@/components/PropertyMap';

interface MapDisplayProps {
  property: IProperty;
}

const MapDisplay = ({ property }: MapDisplayProps) => {
  if (!property) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6 transition-colors">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Location Map
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {property.location?.city
            ? `${property.location.city}, ${property.location.state ?? ''}`.trim()
            : property.location?.street}
        </p>
      </div>
      {/*
        Reuse the same Leaflet-based map as the listings page so the
        look-and-feel stays consistent. `mode="single"` skips the
        "Show exact location" CTA (single-property view doesn't need it)
        and zooms in tighter by default.
      */}
      <PropertyMap properties={[property]} mode="single" />
    </div>
  );
};

export default MapDisplay;
