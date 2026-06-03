import { IProperty } from '@/models/Property';

interface PropertyTitleProps {
  property: IProperty;
}

const PropertyTitle = ({ property }: PropertyTitleProps) => {
  return (
    <section className="bg-white dark:bg-slate-900 py-12 transition-colors">
      <div className='container-xl lg:container m-auto px-4'>
        <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4'>{property.name}</h2>
        <p className="text-slate-600 dark:text-slate-300">{property.location.street}, {property.location.city}, {property.location.zipcode}</p>
      </div>
    </section>
  );
};

export default PropertyTitle;
