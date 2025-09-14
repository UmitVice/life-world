const Hero = () => {
  return (
    <>
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Your dream property awaits
            </h1>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
              Explore curated homes, apartments, and rentals across the city.
            </p>
          </div>

          <form className="mt-8 mx-auto max-w-3xl w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="property-type" className="sr-only">Property Type</label>
              <select
                id="property-type"
                className="w-full h-[48px] rounded-xl border border-slate-300 bg-white/90 backdrop-blur text-slate-800 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue="All"
              >
                <option value="All">All</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Room">Room</option>
                <option value="Land">Land</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="location" className="sr-only">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Search by city, state, or ZIP"
                className="w-full h-[48px] rounded-xl border border-slate-300 bg-white/90 backdrop-blur text-slate-800 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition shadow-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Hero;