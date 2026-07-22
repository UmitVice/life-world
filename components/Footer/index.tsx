import Link from 'next/link';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div className="max-w-md"><div className="flex items-center gap-2 font-extrabold text-slate-950 dark:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500"><HiOutlineBuildingOffice2 /></span>Life World</div><p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Discover exceptional homes, compare the details that matter, and connect with property owners in one place.</p></div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Explore</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/properties" className="hover:text-emerald-700">All homes</Link><Link href="/properties/add" className="hover:text-emerald-700">List a property</Link></div></div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Account</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/login" className="hover:text-emerald-700">Sign in</Link><Link href="/register" className="hover:text-emerald-700">Create account</Link><Link href="/terms" className="hover:text-emerald-700">Terms of Service</Link></div></div>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><p>© {new Date().getFullYear()} Life World. All rights reserved.</p><p>Find a place that feels right.</p></div>
    </div>
  </footer>
);

export default Footer;
