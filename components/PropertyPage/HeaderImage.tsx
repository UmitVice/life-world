import { PropertyImage } from '../PropertyImage';

const HeaderImage = ({ image }: { image?: string }) => {
  return (
    <section className="relative overflow-hidden">
      <div className='container-xl m-auto'>
        <div className='relative w-full h-[420px]'>
          <PropertyImage 
            image={image} 
            priority 
            alt=''
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderImage;
