'use client';

import { useState } from 'react';
import { IProperty } from '@/models/Property';
import NotFound from '@/icons/not-found.png';
import CheckMark from '@/icons/check.png';
import RateDisplay from './RateDisplay';
import PropertyStats from './PropertyStats';
import PropertyAmenities from './PropertyAmenities';
import PropertyInfo from './PropertyInfo';
import PropertyDescription from './PropertyDescription';
import MapDisplay from './MapDisplay';
import ImageGallery from './ImageGallery';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';

interface PropertyDetailsProps {
  property: IProperty;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  // Lightbox state. The header image (and any future thumbnail
  // strip) opens the gallery at the clicked image's index.
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const images = property.images ?? [];

  return (
    <main>
      {/*
        PropertyDetails is now a Client Component because the header
        image is interactive (clicking opens the fullscreen gallery).
        Event handlers can't cross the Server → Client Component
        boundary, so the header is rendered inside this client tree
        (rather than in the parent Server Component) so we can pass
        `onImageClick` down.
      */}

      {/* Hero image — clickable, opens the gallery */}
      <PropertyHeaderImage
        image={images[0]}
        onImageClick={() => openGallery(0)}
      />

      <PropertyInfo property={property} />

      {/* Rates & Options */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6 transition-colors">
        <h3 className="text-base font-semibold my-4 bg-slate-900 text-white inline-flex px-3 py-1 rounded-lg">
          Rates & Options
        </h3>
        <RateDisplay property={property} />
      </div>

      {/* Description & Details */}
      <PropertyDescription property={property} />

      {/* Amenities */}
      <PropertyAmenities property={property} />

      {/* Map */}
      <MapDisplay property={property} />

      {/* Fullscreen image gallery — controlled by the header click */}
      <ImageGallery
        images={images}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={galleryIndex}
      />
    </main>
  );
};

export default PropertyDetails;
