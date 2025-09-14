import { IProperty } from "@/models/Property";
import Image from 'next/image';
import NotFound from '@/icons/not-found.png'
import CheckMark from '@/icons/check.png'

interface PropertyDetails {
  property: IProperty;
}

const PropertyDetails = ({ property }: PropertyDetails) => {
  return (
    <main>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center md:text-left">
        <div className="text-slate-500 mb-2">{property?.type}</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{property?.name}</h1>
        <div className="text-slate-600 mb-4 flex align-middle justify-center md:justify-start">
          <i className="fa-solid fa-location-dot text-lg text-emerald-600 mr-2"></i>
          <p>
            {property?.location?.street}, {property?.location?.city}, {property?.location?.zipcode}
          </p>
        </div>

        <h3 className="text-base font-semibold my-4 bg-slate-900 text-white inline-flex px-3 py-1 rounded-lg">
          Rates & Options
        </h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4">
            <div className="text-slate-500 mr-2 font-semibold">Nightly</div>
            <div className="text-2xl font-bold">
              {property?.rates?.nightly ? (
                `${property?.rates?.nightly?.toLocaleString()}`
              ) : (
                <Image src={NotFound} alt="Not Found" width={24} height={24} />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4">
            <div className="text-slate-500 mr-2 font-semibold">Weekly</div>
            <div className="text-2xl font-bold">
              {property?.rates?.weekly ? (
                `${property?.rates?.weekly?.toLocaleString()}`
              ) : (
                <Image src={NotFound} alt="Not Found" width={24} height={24} />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4">
            <div className="text-slate-500 mr-2 font-semibold">Monthly</div>
            <div className="text-2xl font-bold">
              {property?.rates?.monthly ? (
                `${property?.rates?.monthly?.toLocaleString()}`
              ) : (
                <Image src={NotFound} alt="Not Found" width={24} height={24} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Description & Details</h3>
        <div className="flex justify-center gap-6 text-emerald-700 mb-4 text-lg">
          <p>{property?.beds}<span className="hidden sm:inline"> bd</span></p>
          <p>{property?.baths}<span className="hidden sm:inline"> ba</span></p>
          <p>{property?.square_feet}<span className="hidden sm:inline"> sqft</span></p>
        </div>
        <p className="text-slate-600">{property?.description}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 list-none">
          {property?.amenities?.map((amenity, index) => (
            <li key={index} className="flex items-center space-x-2 py-1">
              <Image src={CheckMark} alt="Check Mark" width={18} height={18} className="mr-3" />
              <span className="text-slate-700">{amenity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
        <div id="map"></div>
      </div>
    </main>
  )
};

export default PropertyDetails;