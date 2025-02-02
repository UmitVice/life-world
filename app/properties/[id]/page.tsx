import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import { IProperty } from '@/models/Property';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyPageProps {
  params: {
    id: string;
    name: string;
  };
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  await connectDB();
  const property = await Property.findById(params?.id).lean() as IProperty | null;
    return (
      <>
      <PropertyHeaderImage image={property?.images?.[0]} />
      <section>
        <div>
          <Link 
            href='/properties'
            className='text-blue-500 hover:text-blue-600 flex items-center'>
          <Image 
            src='/images/icons/left-arrow.png'
            alt='Left Arrow'
            width={24}
            height={24}
            className='mr-2' /> Back to the Properties
          </Link>
        </div>
      </section>
      <section className='bg-blue-500'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            {/* Property Info */}
          </div>
        </div>
      </section>
      </>
    )
}

export default PropertyPage;