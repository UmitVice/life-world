import PropertyCard from '@/components/PropertyCard';
import Property from '@/models/Property';
import connectDB from '@/config/database';
import { IProperty } from '@/models/Property';
export const dynamic = 'force-dynamic';

const PropertiesPage = async () => {
  await connectDB();

  const properties: IProperty[] = await Property.find({})
    .lean<IProperty[]>();

  return (
    <div>
      <section className="px-4 py-10">
        <div className="container-xl lg:container m-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Properties</h1>
          {properties?.length === 0 ? (
            <p className="text-slate-600">No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <PropertyCard key={property?._id.toString()} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;