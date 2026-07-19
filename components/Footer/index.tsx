import Link from 'next/link';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div className="max-w-md">
          <div className="flex items-center gap-2 font-extrabold text-slate-950 dark:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500"><HiOutlineBuildingOffice2 /></span>Life World</div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Find your next place with clear details and thoughtfully selected listings. Created by <a href="https://www.umitvice.com/" target="_blank" rel="noopener noreferrer" className="text-inherit underline-offset-4 hover:underline">Ümit Vice</a>.</p>
        </div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Explore</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/properties" className="hover:text-slate-900 dark:hover:text-white">All homes</Link><Link href="/properties?type=Apartment" className="hover:text-slate-900 dark:hover:text-white">Apartments</Link></div></div>
        <div><p className="text-sm font-bold text-slate-950 dark:text-white">Account</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-500"><Link href="/login" className="hover:text-slate-900 dark:hover:text-white">Sign in</Link><Link href="/register" className="hover:text-slate-900 dark:hover:text-white">Create account</Link><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link></div></div>
      </div>
      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800">© {new Date().getFullYear()} Life World. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
