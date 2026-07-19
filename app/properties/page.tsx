import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyMap from '@/components/PropertyMap';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import connectDB from '@/config/database';
import Property, { IProperty } from '@/models/Property';
import { serializeProperties } from '@/utils/serializeProperty';
import { getProperties } from '@/utils/propertyRepository';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Per-page metadata for the listings route. Filter URLs are also
// indexable, so we set a sensible default and let the search engines
// dedupe via the existing `?view=` and filter params.
export const metadata: Metadata = {
  title: 'Browse Properties | Life World',
  description:
    'Explore curated rental and for-sale properties across the US. Filter by city, type, price, beds, and amenities.',
  openGraph: {
    title: 'Browse Properties | Life World',
    description:
      'Explore curated rental and for-sale properties across the US.',
    type: 'website',
  },
};

// Helper: safely converts searchParams value to a number
const toInt = (v: string | string[] | undefined): number | undefined => {
  if (Array.isArray(v)) v = v[0];
  if (v === undefined || v === '') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
};

const toStr = (v: string | string[] | undefined): string | undefined => {
  if (Array.isArray(v)) v = v[0];
  return v && v !== '' ? v : undefined;
};

const toStrArray = (v: string | string[] | undefined): string[] | undefined => {
  if (!v) return undefined;
  if (Array.isArray(v)) return v.flatMap((s) => s.split(',')).filter(Boolean);
  return v.split(',').filter(Boolean);
};

const PAGE_SIZE = 12; // ideal count for a responsive grid

type ViewMode = 'list' | 'map';

const PropertiesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const sp = await searchParams;

  // Filter and pagination parameters
  const type = toStr(sp.type);
  const city = toStr(sp.city);
  const minBeds = toInt(sp.minBeds);
  const maxBeds = toInt(sp.maxBeds);
  const minPrice = toInt(sp.minPrice);
  const maxPrice = toInt(sp.maxPrice);
  const amenities = toStrArray(sp.amenities);
  const view: ViewMode = sp.view === 'map' ? 'map' : 'list';
  const currentPage = Math.max(1, toInt(sp.page) ?? 1);

  // MongoDB query
  const query: Record<string, unknown> = {};
  if (type) query.type = type;
  if (city) query['location.city'] = city;

  if (minBeds !== undefined || maxBeds !== undefined) {
    const beds: Record<string, number> = {};
    if (minBeds !== undefined) beds.$gte = minBeds;
    if (maxBeds !== undefined) beds.$lte = maxBeds;
    query.beds = beds;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const price: Record<string, number> = {};
    if (minPrice !== undefined) price.$gte = minPrice;
    if (maxPrice !== undefined) price.$lte = maxPrice;
    query.$or = [
      { 'rates.nightly': price },
      { 'rates.weekly': price },
      { 'rates.monthly': price },
    ];
  }

  if (amenities && amenities.length > 0) {
    query.amenities = { $in: amenities };
  }

  // Read from DB (no self-fetch, direct model access)
  let properties: IProperty[] = [];
  let total = 0;
  try {
    await connectDB();
    const skip = (currentPage - 1) * PAGE_SIZE;
    const [docs, count] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean<IProperty[]>(),
      Property.countDocuments(query),
    ]);
    // Serialize so Mongoose ObjectId/Date fields are plain values
    properties = serializeProperties(docs as IProperty[]);
    total = count;
  } catch (error) {
    console.error('PropertiesPage DB error:', error);
    const fallbackProperties = await getProperties({ type, location: city });
    const filtered = fallbackProperties.filter((property) => {
      const bedsMatch = (minBeds === undefined || property.beds >= minBeds) && (maxBeds === undefined || property.beds <= maxBeds);
      const rates = [property.rates?.nightly, property.rates?.weekly, property.rates?.monthly].filter((rate): rate is number => typeof rate === 'number');
      const priceMatch = (minPrice === undefined && maxPrice === undefined) || rates.some((rate) => (minPrice === undefined || rate >= minPrice) && (maxPrice === undefined || rate <= maxPrice));
      const amenitiesMatch = !amenities?.length || amenities.some((amenity) => property.amenities.includes(amenity));
      return bedsMatch && priceMatch && amenitiesMatch;
    });
    total = filtered.length;
    const skip = (currentPage - 1) * PAGE_SIZE;
    properties = serializeProperties(filtered.slice(skip, skip + PAGE_SIZE));
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIndex = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="px-4 py-10">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
              Properties
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Explore our curated listings.
            </p>
          </header>

          {/*
            Two-column layout on desktop (lg+): filters as a sticky left
            sidebar, listings on the right. On smaller screens the filter
            collapses to a full-width block above the listings.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <PropertyFilters />
            </aside>

            <div>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Results
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {total > 0
                      ? `Showing ${startIndex}-${endIndex} of ${total} Properties`
                      : '0 Properties Found'}
                  </span>
                </div>
                <ViewToggle currentView={view} />
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xl text-slate-600 dark:text-slate-300">
                    No properties found matching your filters.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Try adjusting or resetting the filters above.
                  </p>
                </div>
              ) : view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id?.toString() ?? property.name}
                      property={property}
                    />
                  ))}
                </div>
              ) : (
                <PropertyMap properties={properties} />
              )}

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertiesPage;
