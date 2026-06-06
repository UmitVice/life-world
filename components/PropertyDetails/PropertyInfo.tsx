import { IProperty } from '@/models/Property';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface PropertyInfoProps {
  property: IProperty;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  return (
    <main>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center md:text-left transition-colors">
        <div className="text-slate-500 dark:text-slate-400 text-sm mb-2">{property?.type}</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{property?.name}</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-4 text-slate-600 dark:text-slate-300">
          {/*
            Using react-icons (FaMapMarkerAlt) instead of the missing
            public/images/icons/location.png. Keeps the build green and
            matches the rest of the project that already uses Font
            Awesome classes (e.g. fa-solid fa-location-dot in
            components/PropertyCard).
          */}
          <FaMapMarkerAlt className="text-emerald-600 text-lg flex-shrink-0" />
          <p className="text-sm text-center md:text-left">
            {property?.location?.street}, {property?.location?.city}, {property?.location?.zipcode}
          </p>
        </div>
      </div>
    </main>
  );
};

export default PropertyInfo;
