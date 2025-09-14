import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import PropertyCard from '@/components/PropertyCard';
import connectDB from '@/config/database';
import Property, { IProperty } from '@/models/Property';

const HomeProperties = async () => {
  noStore();
  await connectDB();

  const recentProperties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean<IProperty[]>();

  return (
    <>
    <section className="px-4 py-12 bg-slate-50">
    <div className="container-xl lg:container m-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
        Recently Added
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentProperties?.length === 0 ? (
          <p>No properties found</p>
        ) : (recentProperties?.map((property) => (
            <PropertyCard key={property?._id?.toString()} property={property} />
        )))}
      </div>
    </div>
    </section>

    <section className="m-auto max-w-lg my-10 px-6">
      <Link
        href="/properties"
        className="block bg-slate-900 text-white text-center py-4
        px-6 rounded-xl hover:bg-slate-800 transition"
      >View All Properties
      </Link>
    </section>
    </>
  )
}

export default HomeProperties;