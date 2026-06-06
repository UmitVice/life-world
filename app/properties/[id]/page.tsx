import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import { IProperty } from '@/models/Property';
import { serializeProperty } from '@/utils/serializeProperty';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyPageProps {
  // Next.js 15+ delivers `params` as a Promise; the previous signature
  // (plain object) silently gave `params.id === undefined`, which made
  // Property.findById(undefined) return null on every request. Accept the
  // new shape and `await` it before use.
  params: Promise<{
    id: string;
    name?: string;
  }>;
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  const { id } = await params;
  let property: IProperty | null = null;
  try {
    await connectDB();
    const doc = await Property.findById(id).lean();
    // Serialize so Mongoose ObjectId/Date fields are plain values
    property = doc ? serializeProperty(doc as unknown as IProperty) : null;
  } catch (error) {
    // fall back to not found state below
  }
    return (
      <>
      <PropertyHeaderImage image={property?.images?.[0]} />
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties'
            className='text-gray-500 hover:text-gray-600 flex items-center'>
          <Image
            src='/images/icons/left-arrow.png'
            alt='Left Arrow'
            width={24}
            height={24}
            className='mr-2' /> Back to the Properties
          </Link>
        </div>
      </section>
      <section className='bg-slate-50'>
        <div className='max-w-[1280px] mx-auto py-10 px-4 sm:px-6'>
          {/*
            `md:grid-cols-70/30` was an invalid Tailwind class, so on
            desktop the grid silently collapsed to a single full-width
            column and the listing stretched edge-to-edge. With only one
            child (`<PropertyDetails />`), the right column would have
            been empty anyway, so we use a single centered container
            capped at 1280px (matching the listings page).
          */}
          {property ? <PropertyDetails property={property} /> : <div>Property not found</div>}
        </div>
      </section>
      </>
    )
}

export default PropertyPage;
