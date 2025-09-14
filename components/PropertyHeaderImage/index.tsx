import Image from 'next/image';

interface PropertyHeaderImageProps {
  image?: string;
}

const PropertyHeaderImage = ({ image }: PropertyHeaderImageProps) => {
  return (
    <section className="relative">
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          <Image 
            src={`/images/properties/${image}`}
            alt=''
            className='object-cover h-[420px] w-full rounded-b-3xl'
            width={0}
            height={0}
            sizes='100vw'
          />
        </div>        
      </div>
    </section>
  )
}

export default PropertyHeaderImage;