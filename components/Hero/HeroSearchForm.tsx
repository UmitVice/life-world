'use client';

const HeroSearchForm = () => {
  return (
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
    </form>
  );
};

export default HeroSearchForm;
