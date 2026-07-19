import Link from 'next/link';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div className="max-w-md"><div className="flex items-center gap-2 font-extrabold text-slate-950 dark:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500"><HiOutlineBuildingOffice2 /></span>Life World</div><p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">A full-stack real estate marketplace built as a product engineering case study by Ümit Vice.</p></div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Explore</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/properties" className="hover:text-emerald-700">All homes</Link><Link href="/project" className="hover:text-emerald-700">Case study</Link></div></div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Product</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/terms" className="hover:text-emerald-700">Demo terms</Link><Link href="/api/health" className="hover:text-emerald-700">System status</Link></div></div>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><p>© {new Date().getFullYear()} Life World. Portfolio demonstration.</p><p>Designed and engineered with care.</p></div>
    </div>
  </footer>
);

export default Footer;
