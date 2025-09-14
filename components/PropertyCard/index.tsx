import Image from "next/image";
import Link from "next/link";
import { IProperty } from '@/models/Property';

interface PropertyCardProps {
  property: IProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const placeHolderImagePath = '/images/placeholder.jpg';
  const getRentalRate = (): string => {
    const { rates } = property;
    if (rates?.monthly) {
      return `$${rates?.monthly?.toLocaleString()}/mo`;
    } else if (rates?.weekly) {
      return `$${rates?.weekly?.toLocaleString()}/wk`;
    } else if (rates?.nightly) {
      return `$${rates?.nightly?.toLocaleString()}/ni`;
    }
    return '';
  };

  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-emerald-400/40 dark:hover:ring-emerald-400/30">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={property?.images?.[0] ? `/images/properties/${property?.images?.[0]}` : placeHolderImagePath}
          alt=""
          fill
          className="object-cover group-hover:scale-[1.02] transition"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
        {getRentalRate() && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 dark:bg-slate-800/80 backdrop-blur px-2.5 py-0.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-sm">
            {getRentalRate()}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="mb-2">
          <div className="text-slate-500 dark:text-slate-400 text-xs">{property?.type}</div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{property?.name}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mb-2.5">{property?.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-xs">
            <span>{property?.beds} bd</span>
            <span>{property?.baths} ba</span>
            <span>{property?.square_feet} sqft</span>
          </div>
          <Link
            href={`/properties/${property?._id}`}
            className="inline-flex items-center rounded-lg bg-slate-900 text-white px-2.5 py-1.5 text-xs font-medium hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition"
          >
            Details
          </Link>
        </div>
        <div className="mt-2.5 text-slate-500 dark:text-slate-300 text-xs flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-emerald-600"></i>
          <span>{property?.location?.city}, {property?.location?.state}</span>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard;