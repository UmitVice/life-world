import PropertyDetails from '@/components/PropertyDetails';
import { IProperty } from '@/models/Property';
import { serializeProperty } from '@/utils/serializeProperty';
import { getProperty } from '@/utils/propertyRepository';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface PropertyPageProps {
  // Next.js 15+ delivers `params` as a Promise; the previous signature
  // (plain object) silently gave `params.id === undefined`, which made
  // Property.findById(undefined) return null on every request.
  params: Promise<{
    id: string;
    name?: string;
  }>;
}

// ---- Per-page SEO metadata ----
// Title and description are driven by the property itself, so search
// engines and social previews show the actual listing instead of the
// generic site title. `openGraph.images` is left empty for now; can be
// wired to a CDN/Cloudinary URL later.
export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const doc = await getProperty(id);
    if (!doc) return { title: 'Property Not Found | Life World' };

    const title = `${doc.name} | Life World`;
    const description =
      doc.description?.slice(0, 160) ||
      `${doc.type} in ${doc.location?.city ?? ''}`.trim();

    return {
      title,
      description,
      openGraph: {
        title: doc.name,
        description,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: doc.name,
        description,
      },
    };
  } catch {
    return { title: 'Property Not Found | Life World' };
  }
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  const { id } = await params;

  let property: IProperty | null = null;
  try {
    const doc = await getProperty(id);
    property = doc ? serializeProperty(doc as unknown as IProperty) : null;
  } catch (error) {
    console.error('PropertyPage DB error:', error);
  }

  // If the DB roundtrip succeeded but the id didn't match a document,
  // also surface a real 404 (with a friendly page from app/not-found.tsx).
  if (!property) notFound();

  return (
    <>
      {/*
        The hero image used to be rendered here, but it's now
        rendered inside <PropertyDetails /> (a Client Component) so
        it can wire `onClick` → gallery without crossing the
        Server → Client boundary.
      */}
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-gray-500 hover:text-gray-600 flex items-center"
          >
            <Image
              src="/images/icons/left-arrow.png"
              alt="Left Arrow"
              width={24}
              height={24}
              className="mr-2"
            />{' '}
            Back to the Properties
          </Link>
        </div>
      </section>
      <section className="bg-slate-50">
        <div className="max-w-[1280px] mx-auto py-10 px-4 sm:px-6">
          <PropertyDetails property={property} />
        </div>
      </section>
    </>
  );
};

export default PropertyPage;
