'use client';

import Image from 'next/image';

interface PropertyHeaderImageProps {
  image?: string;
  onImageClick?: () => void;
}

const PropertyHeaderImage = ({ image, onImageClick }: PropertyHeaderImageProps) => {
  // The header is rendered at up to 1280×420 px, so we serve the
  // 1280w WebP variant. We previously served the 400w card
  // variant which was getting upscaled and looked blurry.
  const webp = image
    ? `/images/properties/header/${image.replace(/\.(jpe?g|png)$/i, '')}.webp`
    : '/images/placeholder.webp';
  const fallback = image
    ? `/images/properties/${image}`
    : '/images/placeholder.jpg';

  return (
    <section className="relative overflow-hidden">
      {/*
        Constrain to 1280px to stay consistent with the listings
        page and look reasonable on ultrawide screens. The previous
        `container-xl` class wasn't real Tailwind.
      */}
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6">
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] rounded-b-3xl overflow-hidden">
          {/*
            next/image gives us:
              - automatic WebP/AVIF for supporting browsers
              - responsive `sizes` so a 1280px-wide header doesn't
                request a 4000px-wide image
              - `priority` (LCP optimization) for the largest
                above-the-fold image
              - graceful fallback to the original jpg if the webp
                variant doesn't exist yet

            We mark this component as a Client Component because
            we're passing `onError` and (optionally) `onClick`
            event handlers. Event handlers can't be passed from a
            Server Component to a Client Component (which
            `next/image` is).
          */}
          <button
            type="button"
            onClick={onImageClick}
            disabled={!onImageClick}
            aria-label={onImageClick ? 'View image in fullscreen' : undefined}
            className="group absolute inset-0 z-10 flex h-full w-full cursor-pointer items-end justify-end overflow-hidden border-0 bg-transparent p-0 disabled:cursor-default"
          >
            <Image
              src={webp}
              alt=""
              fill
              priority
              quality={80}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 1280px"
              className="object-cover rounded-b-3xl pointer-events-none"
              onError={(e) => {
                // next/image forwards error events from the
                // underlying <img>. If the webp isn't there, swap
                // to the original jpg.
                const img = e.currentTarget;
                if (img.src !== fallback) {
                  img.src = fallback;
                }
              }}
            />
            {/*
              Subtle "click to enlarge" affordance so users know the
              hero is interactive. Hidden when no click handler.
            */}
            {onImageClick && (
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-white shadow-sm">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75h6v2.5h-3.5v3.5h-2.5v-6zm12.5 0h6v6h-2.5v-3.5h-3.5v-2.5zM3.75 14.25h2.5v3.5h3.5v2.5h-6v-6zm12.5 0h2.5v6h-6v-2.5h3.5v-3.5z"
                  />
                </svg>
                Click to enlarge
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
