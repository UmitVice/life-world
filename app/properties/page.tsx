import PropertyCard from '@/components/PropertyCard';
import Property from '@/models/Property';
import connectDB from '@/config/database';
import { IProperty } from '@/models/Property';

const PropertiesPage = async () => {
  await connectDB();

  const properties: IProperty[] = await Property.find({})
    .lean<IProperty[]>();

  return (
    <div>
      <section className="px-4 py-6">
      <h1 className="text-3xl container-xl lg:container m-auto px-4 py-2">Properties</h1>
        <div className="container-xl lg:container m-auto px-4 py-6">
          {properties?.length === 0 ? (
            <p>No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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