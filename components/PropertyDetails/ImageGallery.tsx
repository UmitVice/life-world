'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  /** Image filenames from the property. Empty array → lightbox no-op. */
  images: string[];
  /** Whether the lightbox is open. */
  open: boolean;
  /** Called when the user dismisses the lightbox. */
  onClose: () => void;
  /**
   * Optional initial index (defaults to 0). Use this when the
   * lightbox is opened from a specific thumbnail.
   */
  initialIndex?: number;
}

/**
 * Property details lightbox. Renders a fullscreen, scroll-locked
 * overlay with the current image, prev/next navigation, keyboard
 * support, and mobile swipe gestures.
 *
 * Implementation is dependency-free (no `yet-another-react-lightbox`
 * or similar) because the requirements are narrow and a small,
 * purpose-built component is easier to maintain and theme.
 */
const ImageGallery = ({
  images,
  open,
  onClose,
  initialIndex = 0,
}: ImageGalleryProps) => {
  const [index, setIndex] = useState<number>(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  // Reset index whenever the gallery is (re-)opened.
  useEffect(() => {
    if (open) {
      setIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)));
    }
  }, [open, initialIndex, images.length]);

  const total = images.length;
  const hasMultiple = total > 1;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [total]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );

  // ---- Keyboard navigation ----
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, next, prev]);

  // ---- Body scroll lock ----
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ---- Swipe (touch) navigation ----
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (!open || total === 0) return null;

  // Build the current image's src. We reuse the header variant
  // because it's the largest available — fullscreen display
  // benefits from higher resolution.
  const current = images[index];
  const baseName = current.replace(/\.(jpe?g|png)$/i, '');
  const webp = `/images/properties/header/${baseName}.webp`;
  const fallback = `/images/properties/${current}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${total}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 sm:p-8 transition-opacity duration-200"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6l12 12m0-12L6 18"
          />
        </svg>
      </button>

      {/* Counter (top-left) */}
      <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-white">
        {index + 1} / {total}
      </div>

      {/* Prev button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {/* The image itself — stop click propagation so tapping the
          image doesn't close the lightbox. */}
      <div
        className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={webp}
          alt={`Property image ${index + 1} of ${total}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-[fadeIn_0.2s_ease-out]"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== fallback) {
              img.src = fallback;
            }
          }}
        />
      </div>

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
