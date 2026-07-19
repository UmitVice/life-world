'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowUpRight, HiOutlineMapPin } from 'react-icons/hi2';
import { IProperty } from '@/models/Property';

const PropertyCard = ({ property }: { property: IProperty }) => {
  const firstImage = property.images?.[0];
  const webpImage = firstImage ? `/images/properties/card/${firstImage.replace(/\.(jpe?g|png)$/i, '')}.webp` : '/images/properties/marker/placeholder.webp';
  const fallbackImage = firstImage ? `/images/properties/${firstImage}` : '/images/placeholder.jpg';
  const [imageSrc, setImageSrc] = useState(webpImage);
  useEffect(() => setImageSrc(webpImage), [webpImage]);
  const rate = property.rates?.monthly
    ? `$${property.rates.monthly.toLocaleString()}`
    : property.rates?.weekly
      ? `$${property.rates.weekly.toLocaleString()}`
      : property.rates?.nightly
        ? `$${property.rates.nightly.toLocaleString()}`
        : 'Contact';
  const cadence = property.rates?.monthly ? '/ month' : property.rates?.weekly ? '/ week' : property.rates?.nightly ? '/ night' : '';

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/properties/${property._id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
          <Image src={imageSrc} onError={() => imageSrc !== fallbackImage && setImageSrc(fallbackImage)} alt={`${property.name} in ${property.location.city}`} fill quality={80} className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur">{property.type}</span>
          {property.is_featured && <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950">Featured</span>}
          <div className="absolute bottom-4 left-4 text-white"><span className="text-2xl font-bold">{rate}</span><span className="ml-1 text-sm text-white/80">{cadence}</span></div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">{property.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><HiOutlineMapPin className="h-4 w-4 text-emerald-600" />{property.location.city}, {property.location.state}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white dark:border-slate-700 dark:text-white"><HiOutlineArrowUpRight /></span></div>
          <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300"><span><b className="text-slate-950 dark:text-white">{property.beds}</b> beds</span><span><b className="text-slate-950 dark:text-white">{property.baths}</b> baths</span><span><b className="text-slate-950 dark:text-white">{property.square_feet.toLocaleString()}</b> sq ft</span></div>
        </div>
      </Link>
    </article>
  );
};

export default PropertyCard;
