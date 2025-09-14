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
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={property?.images?.[0] ? `/images/properties/${property?.images?.[0]}` : placeHolderImagePath}
          alt=""
          fill
          className="object-cover group-hover:scale-[1.02] transition"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
        {getRentalRate() && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-emerald-700 text-sm font-semibold shadow-sm">
            {getRentalRate()}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2">
          <div className="text-slate-500 text-sm">{property?.type}</div>
          <h3 className="text-lg font-semibold text-slate-900">{property?.name}</h3>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{property?.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-600 text-sm">
            <span>{property?.beds} bd</span>
            <span>{property?.baths} ba</span>
            <span>{property?.square_feet} sqft</span>
          </div>
          <Link
            href={`/properties/${property?._id}`}
            className="inline-flex items-center rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800 transition"
          >
            Details
          </Link>
        </div>
        <div className="mt-3 text-slate-500 text-sm flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-emerald-600"></i>
          <span>{property?.location?.city}, {property?.location?.state}</span>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard;