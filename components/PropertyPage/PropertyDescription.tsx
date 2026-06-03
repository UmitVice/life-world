import { IProperty } from '@/models/Property';

interface PropertyDescriptionProps {
  property: IProperty;
}

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  return (
    <section className="bg-white dark:bg-slate-900 py-12 transition-colors">
      <div className='container-xl lg:container m-auto px-4'>
        <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-6'>{property.name}</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{property.description}</p>
      </div>
    </section>
  );
};

export default PropertyDescription;
