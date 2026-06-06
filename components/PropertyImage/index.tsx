'use client';

import React, { useState } from 'react';

interface PropertyImageProps {
  image?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

const DEFAULT_IMAGE = '/images/placeholder.jpg'; // File that actually exists in /public

const buildSrc = (image?: string): string => {
  if (!image || image.trim() === '') return DEFAULT_IMAGE;
  // If the image is already an absolute URL or a path that already starts with
  // "/", don't prepend the local properties directory prefix.
  if (/^(https?:)?\/\//i.test(image) || image.startsWith('/')) return image;
  return `/images/properties/${image}`;
};

export const PropertyImage: React.FC<PropertyImageProps> = ({
  image,
  alt = 'Property Image',
  priority = false,
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(buildSrc(image));

  // If the `image` prop changes after mount, keep the local state in sync.
  React.useEffect(() => {
    setImgSrc(buildSrc(image));
  }, [image]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/*
        We use a plain <img> instead of next/image's `fill` mode.
        Reason: `next/image fill` generates different style attribute
        serializations between SSR ("0px") and CSR (0), which triggers
        a React hydration mismatch. The underlying files are static
        assets under /public, so Next.js image optimization is not
        needed here. This also keeps the behavior consistent with
        components/PropertyCard and avoids the /_next/image endpoint
        in environments where it may fail.
      */}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => {
          if (imgSrc !== DEFAULT_IMAGE) setImgSrc(DEFAULT_IMAGE);
        }}
      />
    </div>
  );
};

export default PropertyImage;
