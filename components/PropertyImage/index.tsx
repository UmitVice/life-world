import Image from 'next/image';

interface PropertyImageProps {
  image?: string;
  alt?: string;
  priority?: boolean;
}

const DEFAULT_IMAGE = '/images/placeholder.png'; // Ensure this exists or use a hosted URL

export const PropertyImage = ({ 
  image, 
  alt = 'Property Image', 
  priority = false 
}: PropertyImageProps) => {
  // If image is provided and not empty, prepend the path. 
  // Otherwise, use the default placeholder.
  const src = (image && image.trim() !== '') 
    ? `/images/properties/${image}` 
    : DEFAULT_IMAGE;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-b-3xl"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
