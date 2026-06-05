'use client';

import { IProperty } from '@/models/Property';
import CheckMarkIcon from '@/icons/check.png';
import Image from 'next/image';

interface PropertyAmenitiesProps {
  property: IProperty;
}

const PropertyAmenities = ({ property }: PropertyAmenitiesProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Amenities</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 list-none">
        {property?.amenities?.map((amenity, index) => (
          <li key={index} className="flex items-center space-x-2 py-1">
            <Image 
              src={CheckMarkIcon} 
              alt="Check Mark" 
              width={18} 
              height={18} 
              className="mr-3 flex-shrink-0" 
            />
            <span className="text-slate-700 dark:text-slate-300 text-sm">{amenity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyAmenities;
