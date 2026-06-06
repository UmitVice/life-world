'use client';

import Image from 'next/image';

const PropertyHeaderImage = ({ image }: { image?: string }) => {
  // Build the pre-generated webp URL from the original jpg path.
  // We don't pre-generate a "hero" variant because the header is
  // 420px tall on md+ screens and `next/image` will dynamically
  // serve the smallest size that fits the responsive layout.
  const webp = image
    ? `/images/properties/card/${image.replace(/\.(jpe?g|png)$/i, '')}.webp`
    : '/images/placeholder.webp';
  const fallback = image
    ? `/images/properties/${image}`
    : '/images/placeholder.jpg';

  return (
    <section className="relative overflow-hidden">
      {/*
        Previously used `container-xl`, which is not a real Tailwind class,
        so the inner div had no max-width and the image stretched to the
        full viewport width on large monitors. Constrain to 1280px to
        stay consistent with the listings page and look reasonable on
        ultrawide screens.
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
            we're passing an `onError` event handler. Event handlers
            can't be passed from a Server Component to a Client
            Component (which `next/image` is).
          */}
          <Image
            src={webp}
            alt=""
            fill
            priority
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 1280px"
            className="object-cover rounded-b-3xl"
            onError={(e) => {
              // next/image forwards error events from the underlying
              // <img>. If the webp isn't there, swap to the original
              // jpg. We mutate the currentTarget.src so the swap
              // doesn't trigger another React state update cycle.
              const img = e.currentTarget;
              if (img.src !== fallback) {
                img.src = fallback;
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
