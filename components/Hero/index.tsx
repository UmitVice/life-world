import Link from 'next/link';

const Hero = () => (
  <section className="relative isolate overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-[url('/images/properties/v1.jpg')] bg-cover bg-[center_42%] opacity-55" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
    <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          120+ verified homes added this month
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
          A better way to find your <span className="text-emerald-300">next place.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
          Thoughtfully curated homes, transparent pricing, and the details that matter—so you can decide with confidence.
        </p>
      </div>

      <form action="/properties" className="mt-10 grid max-w-4xl gap-2 rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl shadow-black/30 backdrop-blur sm:grid-cols-[180px_1fr_auto] dark:bg-slate-900/95">
        <label htmlFor="property-type" className="sr-only">Property type</label>
        <select id="property-type" name="type" defaultValue="All" className="h-14 rounded-xl border-0 bg-slate-100 px-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white">
          <option value="">All home types</option><option>Apartment</option><option>House</option><option>Villa</option><option>Condo</option><option>Townhouse</option>
        </select>
        <label htmlFor="city" className="sr-only">City</label>
        <input id="city" name="city" placeholder="Try Miami, Denver, or New York" className="h-14 rounded-xl border-0 bg-slate-100 px-5 text-slate-900 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white" />
        <button type="submit" className="h-14 rounded-xl bg-emerald-600 px-7 font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Search homes</button>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-300">
        <span className="font-semibold text-white">Popular:</span>
        <Link href="/properties?city=Miami" className="underline-offset-4 hover:text-white hover:underline">Miami</Link>
        <Link href="/properties?city=Denver" className="underline-offset-4 hover:text-white hover:underline">Denver</Link>
        <Link href="/properties?type=Apartment" className="underline-offset-4 hover:text-white hover:underline">City apartments</Link>
      </div>
    </div>
  </section>
);

export default Hero;
