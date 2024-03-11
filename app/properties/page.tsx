import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import properties from "@/properties.json"

const PropertiesPage = () => {
    return (
      <div>
        <h1 className="text-3xl">Properties</h1>
        <Link href="/">Go Home</Link>
        <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          {properties?.length === 0 ? (
            <p>No properties found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties?.map((property) =>(
              <PropertyCard key={property?._id} property={property}/>
            ))}
          </div>
          )}
        </div>
        </section>
      </div>
    )
}

export default PropertiesPage;