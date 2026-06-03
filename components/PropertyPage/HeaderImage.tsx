import Image from 'next/image';

interface HeaderImageProps {
  image?: string;
}

const HeaderImage = ({ image }: HeaderImageProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className='container-xl m-auto'>
        <div className='relative w-full h-[420px]'>
          <Image
            src={`/images/properties/${image}`}
            alt=''
            className='object-cover rounded-b-3xl'
            fill
            sizes='100vw'
            priority
            loading='eager'
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderImage;
