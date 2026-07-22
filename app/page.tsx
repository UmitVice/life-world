import Hero from '@/components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from "@/components/HomeProperties";
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineBolt, HiOutlineShieldCheck } from 'react-icons/hi2';

const HomePage = () => {
    return (
      <>
        <Hero />
        <InfoBoxes />
        <HomeProperties />
        <section className="bg-slate-950 px-4 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">Made for every move</p>
              <h2 className="font-display mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">From first search to a confident shortlist.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Life World brings discovery, comparison, and owner-managed listings into one focused experience, helping you move from search to shortlist with confidence.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/properties" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400">Explore the marketplace <HiOutlineArrowRight /></Link><Link href="/properties/add" className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">List a property</Link></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-6"><HiOutlineBolt className="h-7 w-7 text-emerald-400" /><p className="mt-8 text-4xl font-semibold">3-step</p><p className="mt-2 text-slate-400">search-to-detail journey</p></article>
              <article className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:translate-y-8"><HiOutlineShieldCheck className="h-7 w-7 text-emerald-400" /><p className="mt-8 text-4xl font-semibold">One place</p><p className="mt-2 text-slate-400">to search, compare, and connect</p></article>
              <article className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Designed around your needs</p><p className="mt-2 text-xl font-semibold">Clear listings · Flexible search · Direct contact</p></div><span className="hidden text-5xl text-white/20 sm:block" aria-hidden="true">↗</span></div></article>
            </div>
          </div>
        </section>
      </>
    )
}

export default HomePage;
