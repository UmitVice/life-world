import { HiOutlineCheckBadge, HiOutlineMapPin, HiOutlineScale } from 'react-icons/hi2';

const benefits = [
  { icon: HiOutlineCheckBadge, title: 'Detailed listings', copy: 'Compare photos, essential details, amenities, and pricing in a consistent format.' },
  { icon: HiOutlineMapPin, title: 'Local context', copy: 'Search by the places you care about and compare the essentials without opening ten tabs.' },
  { icon: HiOutlineScale, title: 'Confident decisions', copy: 'Clear amenities, flexible rates, and direct contact details put you in control.' },
];

const InfoBoxes = () => (
  <section className="border-b border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">The Life World difference</p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Less scrolling. More certainty.</h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, copy }, index) => (
          <article key={title} className="group rounded-3xl border border-slate-200 bg-stone-50 p-7 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-slate-700 dark:bg-slate-950">
            <div className="mb-8 flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Icon className="h-6 w-6" /></span><span className="font-display text-sm text-slate-400">0{index + 1}</span></div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{copy}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default InfoBoxes;
