import { PropertyImage } from '../PropertyImage';

const PropertyHeaderImage = ({ image }: { image?: string }) => {
  return (
    <section className="relative overflow-hidden">
      {/*
        Previously used `container-xl`, which is not a real Tailwind class,
        so the inner div had no max-width and the image stretched to the
        full viewport width on large monitors. Constrain to 1280px to
        stay consistent with the listings page and look reasonable on
        ultrawide screens.
      */}
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6">
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] rounded-b-3xl overflow-hidden">
          <PropertyImage
            image={image}
            priority
            alt=""
            className="rounded-b-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
