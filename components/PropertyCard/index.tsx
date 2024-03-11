import Image from "next/image";
import Link from "next/link";

interface Property {
  type: string;
  name: string;
  rates: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  }
  images?: string[];
  beds: number;
  baths: number;
  square_feet: number;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {

  const placeHolderImagePath = "/images/properties/1.jpg";

  const getRentalRate = () => {
    const { rates } = property;

    if (rates?.monthly) {
        return `$${rates?.monthly}/monthly`;
    } else if (rates?.weekly) {
        return `$${rates?.weekly}/weekly`;
    } else if (rates?.nightly) {
        return `$${rates?.nightly}/nightly`;
    } else {
        return "Price not available";
    }
  }

  return (
    <div className="rounded-xl shadow-md relative bg-sky-100">
    <Image
      src={property?.images?.[0] ? `/images/properties/${property?.images?.[0]}` : placeHolderImagePath}
      alt=""
      height={500}
      width={500}
      className="w-full h-auto rounded-t-xl"
    />
    <div className="p-2">
      <div className="text-left md:text-center lg:text-left mb-6">
        <div className="text-gray-600">{property?.type}</div>
        <h3 className="text-xl font-bold">{property?.name}</h3>
      </div>
      <h3
        className="relative  bg-white px-4 py-2 rounded-lg text-green-500 font-bold md:text-center"
      >
        {getRentalRate()}
      </h3>

      <div className="flex justify-center gap-4 text-gray-500 mb-4">
        <p>
          <i className="fa-solid fa-bed"></i> {property?.beds} { " " }
          <span className="md:hidden lg:inline">Beds</span>
        </p>
        <p>
          <i className="fa-solid fa-bath"></i> {property?.baths} { " " }
          <span className="md:hidden lg:inline">Baths</span>
        </p>
        <p>
          <i className="fa-solid fa-ruler-combined"></i>
          {property?.square_feet} <span className="md:hidden lg:inline">sqft</span>
        </p>
      </div>

      <div
        className="flex justify-center gap-4 text-green-900 text-sm mb-4"
      >
      </div>

      <div className="border border-gray-100 mb-5"></div>

      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <div className="flex align-middle gap-2 mb-4 lg:mb-0">
          <i
            className="fa-solid fa-location-dot text-lg text-orange-700"
          ></i>
          <span className="text-orange-700"> Boston MA </span>
        </div>
        <Link
          href="/property"
          className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  </div>
  )
}

export default PropertyCard;