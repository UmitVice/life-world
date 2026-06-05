"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { IProperty } from '@/models/Property';

interface PropertyCardProps {
  property: IProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Local fallback: avoid external URLs (no Image Optimization issues)
  const fallbackImagePath = '/images/placeholder.jpg';

  const [imgSrc, setImgSrc] = useState<string>(
    property?.images?.[0] ? `/images/properties/${property.images[0]}` : fallbackImagePath
  );

  const getRentalRate = (): string => {
    const { rates } = property;
    if (rates?.monthly) {
      return `$${rates.monthly.toLocaleString()}/mo`;
    } else if (rates?.weekly) {
      return `$${rates.weekly.toLocaleString()}/wk`;
    } else if (rates?.nightly) {
      return `$${rates.nightly.toLocaleString()}/ni`;
    }
    return '';
  };

  return (
    <div className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-emerald-400/40 dark:hover:ring-emerald-400/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/*
          We use a plain <img> instead of next/image's `fill` mode.
          Reason: `next/image fill` generates different style attribute
          serializations between SSR ("0px") and CSR (0), which triggers
          a React hydration mismatch. The underlying files are static
          assets under /public, so Next.js image optimization is not
          needed here.
        */}
        <img
          src={imgSrc}
          alt={property?.name || 'Property image'}
          loading={property?.is_featured ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition"
          onError={() => setImgSrc(fallbackImagePath)}
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
