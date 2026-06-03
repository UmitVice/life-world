import { IProperty } from '@/models/Property';

interface PropertyContactProps {
  property: IProperty;
}

const PropertyContact = ({ property }: PropertyContactProps) => {
  return (
    <section className="bg-white dark:bg-slate-900 py-12 transition-colors">
      <div className='container-xl lg:container m-auto px-4'>
        <h3 className='text-2xl font-bold text-slate-900 dark:text-white mb-6'>Contact</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Contact us to schedule a tour and learn more about this property.
        </p>
      </div>
    </section>
  );
};

export default PropertyContact;
