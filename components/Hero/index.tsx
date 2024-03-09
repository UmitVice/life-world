const Hero = () => {
  return (
    <>
    <section className="bg-cyan-700 py-20 mb-4">
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div className="text-center">
        <h1
          className="text-4xl font-extrabold my-6 text-white sm:text-5xl md:text-6xl"
        >
          Your Next Home Awaits
        </h1>
     
      </div>
      <form
        className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
      >
   
        <div className="w-full md:w-2/5 md:pl-2">
          
          <label htmlFor="property-type" className="sr-only">Property Type</label>
          <select
            id="property-type"
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
            <option value="Land">Land</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0 ml-5">
          <label htmlFor="location" className="sr-only">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter Location (State, City, Zip, etc)"
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      <p className="my-6 text-xl text-white">
          Explore properties designed for comfort and convenience.
        </p>
    </div>
  </section>
  </>
  )
}

export default Hero;