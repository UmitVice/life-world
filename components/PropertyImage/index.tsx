'use client';

import React, { useState } from 'react';

interface PropertyImageProps {
  image?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

const PLACEHOLDER_WEBP = '/images/placeholder.webp';
const PLACEHOLDER_JPG = '/images/placeholder.jpg';

const isImageFile = (s: string) => s.trim().length > 0;

/**
 * Build the URL for a property's marker avatar. The map markers
 * live at 96×96 — small enough that we pre-generate them as
 * `marker/<name>.webp` and fall back to the original `.jpg` if
 * the optimized variant hasn't been generated yet (e.g. a new
 * image was uploaded without re-running `yarn optimize-images`).
 *
 * Keeping the fallback means a stale build can't break the map
 * — the worst case is "uses JPG, slightly larger" instead of
 * "broken image".
 */
const buildSrc = (image?: string): { webp: string; fallback: string } => {
  if (!isImageFile(image ?? '')) {
    return { webp: PLACEHOLDER_WEBP, fallback: PLACEHOLDER_JPG };
  }
  if (/^(https?:)?\/\//i.test(image!) || image!.startsWith('/')) {
    return { webp: image!, fallback: image! };
  }
  // The `image` value in seed is e.g. "a1.jpg". We strip the .jpg
  // to get the base name and append `.webp`.
  const baseName = image!.replace(/\.(jpe?g|png)$/i, '');
  return {
    webp: `/images/properties/marker/${baseName}.webp`,
    fallback: `/images/properties/${image}`,
  };
};

export const PropertyImage: React.FC<PropertyImageProps> = ({
  image,
  alt = 'Property Image',
  priority = false,
  className = '',
}) => {
  const sources = buildSrc(image);
  // We start with the optimized webp; onError we fall back to the
  // original jpg (or the original url if it was an absolute link).
  const [src, setSrc] = useState<string>(sources.webp);

  // If the `image` prop changes, re-derive the src.
  React.useEffect(() => {
    setSrc(buildSrc(image).webp);
  }, [image]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/*
        Plain <img> (not next/image) — the underlying files are static
        assets under /public and we already serve an optimized WebP
        variant from the optimize-images script. next/image would
        add a per-request processing round-trip on top of that.

        The plain <img> also matches what the rest of the project
        does for static thumbnails (PropertyCard), avoiding
        hydration mismatches.
      */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => {
          // If the webp variant is missing, fall back to the
          // original (jpg) or placeholder. We only fall back once
          // to avoid an infinite loop if both fail.
          if (src !== sources.fallback) {
            setSrc(sources.fallback);
          }
        }}
      />
    </div>
  );
};

export default PropertyImage;
