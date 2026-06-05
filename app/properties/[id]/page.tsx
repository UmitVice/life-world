import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import { IProperty } from '@/models/Property';
import { serializeProperty } from '@/utils/serializeProperty';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyPageProps {
  params: {
    id: string;
    name: string;
  };
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  let property: IProperty | null = null;
  try {
    await connectDB();
    const doc = await Property.findById(params?.id).lean();
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
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            {property ? <PropertyDetails property={property} /> : <div>Property not found</div>}
          </div>
        </div>
      </section>
      </>
    )
}

export default PropertyPage;
