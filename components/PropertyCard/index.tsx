"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProperty } from '@/models/Property';

interface PropertyCardProps {
  property: IProperty;
}

const FALLBACK_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // We render the card thumbnail from the pre-generated
  // `card/<name>.webp` (400px max, q=80) at 4:3 aspect. If a
  // new image was added without re-running `yarn optimize-images`
  // the next/image 404 fallback will silently render the broken
  // image so we ALSO fall back to the original jpg via onError.
  const firstImage = property?.images?.[0];
  const cardWebp = firstImage
    ? `/images/properties/card/${firstImage.replace(/\.(jpe?g|png)$/i, '')}.webp`
    : '/images/placeholder.webp';
  const cardFallback = firstImage
    ? `/images/properties/${firstImage}`
    : '/images/placeholder.jpg';

  const [imgSrc, setImgSrc] = useState<string>(cardWebp);

  // Re-derive the src if the property changes.
  React.useEffect(() => {
    setImgSrc(cardWebp);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?._id, firstImage]);

  const getRentalRate = (): string => {
    const { rates } = property;
    if (rates?.monthly) return `$${rates.monthly.toLocaleString()}/mo`;
    if (rates?.weekly) return `$${rates.weekly.toLocaleString()}/wk`;
    if (rates?.nightly) return `$${rates.nightly.toLocaleString()}/ni`;
    return '';
  };

  return (
    <div className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-emerald-400/40 dark:hover:ring-emerald-400/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
        {/*
          next/image handles:
            - srcSet with the WebP variant and 1x/2x densities
            - automatic AVIF/WebP serving for browsers that support it
            - lazy loading by default
            - proper width/height attrs to prevent CLS
          The plain <img> fallback in onError handles the
          "ran-the-script-but-image-isn't-there-yet" case.
        */}
        <Image
          src={imgSrc}
          alt={property?.name || 'Property image'}
          fill
          sizes={FALLBACK_SIZES}
          quality={80}
          className="object-cover group-hover:scale-[1.02] transition"
          onError={() => {
            if (imgSrc !== cardFallback) setImgSrc(cardFallback);
          }}
          // Non-featured cards get lazy loading. Featured cards
          // (curated homepage rows) get eager loading.
          priority={Boolean(property?.is_featured)}
        />
        {getRentalRate() && (
          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 dark:bg-slate-800/80 backdrop-blur px-2 py-0.5 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold shadow-sm">
            {getRentalRate()}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <div className="mb-1.5">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wide">{property?.type}</div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{property?.name}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 mb-2">{property?.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
            <span>{property?.beds} bd</span>
            <span>{property?.baths} ba</span>
            <span>{property?.square_feet} sqft</span>
          </div>
          <Link
            href={`/properties/${property?._id}`}
            className="inline-flex items-center rounded-md bg-slate-900 text-white px-2 py-1 text-[10px] font-medium hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition"
          >
            Details
          </Link>
        </div>
        <div className="mt-1.5 text-slate-500 dark:text-slate-300 text-[10px] flex items-center gap-1.5">
          <i className="fa-solid fa-location-dot text-emerald-600"></i>
          <span className="truncate">{property?.location?.city}, {property?.location?.state}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
