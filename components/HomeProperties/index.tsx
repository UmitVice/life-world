import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { getProperties } from '@/utils/propertyRepository';
import { serializeProperties } from '@/utils/serializeProperty';

const HomeProperties = async () => {
  const recentProperties = serializeProperties(await getProperties({ limit: 3 }));

  return (
    <>
    <section className="bg-stone-50 px-4 py-20 dark:bg-slate-950 transition-colors">
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Fresh on the market</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Homes worth a closer look</h2>
        </div>
        <Link href="/properties" className="group inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400">Explore every home <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentProperties.map((property) => (
            <PropertyCard key={property?._id?.toString()} property={property} />
        ))}
      </div>
    </div>
    </section>
    </>
  )
}

export default HomeProperties;
