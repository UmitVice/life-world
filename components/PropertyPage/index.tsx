import HeaderImage from './HeaderImage';
import PropertyTitle from './PropertyTitle';
import PropertyDescription from './PropertyDescription';
import PropertyContact from './PropertyContact';
import { IProperty } from '@/models/Property';

interface PropertyPageProps {
  property: IProperty;
}

const PropertyPage = ({ property }: PropertyPageProps) => {
  return (
    <>
      <HeaderImage image={property.images[0]} />
      <PropertyTitle property={property} />
      <PropertyDescription property={property} />
      <PropertyContact property={property} />
    </>
  );
};

export default PropertyPage;
