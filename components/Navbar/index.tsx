'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { HiBars3, HiOutlineBuildingOffice2, HiXMark } from 'react-icons/hi2';
import ThemeToggle from './ThemeToggle';

const links = [{ href: '/', label: 'Home' }, { href: '/properties', label: 'Homes' }];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [profile, setProfile] = useState(false);

  const navLink = ({ href, label }: typeof links[number]) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return <Link key={href} onClick={() => setMobile(false)} href={href} className={`${active ? 'text-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'} relative rounded-lg px-3 py-2 text-sm font-semibold transition`}>{label}{active && <span className="absolute inset-x-3 -bottom-[13px] hidden h-0.5 rounded-full bg-emerald-500 md:block" />}</Link>;
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8"><Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950 dark:text-white" aria-label="Life World home"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-slate-950"><HiOutlineBuildingOffice2 className="h-5 w-5" /></span>Life World</Link><div className="hidden items-center gap-1 md:flex">{links.map(navLink)}</div></div>
        <div className="hidden items-center gap-2 md:flex"><ThemeToggle />{!session && <><Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:border-slate-950 dark:border-slate-700">Sign in</Link><Link href="/register" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400">Create account</Link></>}{session && <div className="relative"><button onClick={() => setProfile(!profile)} aria-label="Open profile menu" aria-expanded={profile} className="rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"><img src={session.user?.image || '/images/icons/profile.png'} alt="" className="h-9 w-9 rounded-full" /></button>{profile && <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"><Link href="/properties/add" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Add a property</Link>{session.user?.role === 'admin' && <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Admin</Link>}<button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Sign out</button></div>}</div>}<Link href="/properties" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950">Browse homes</Link></div>
        <div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} onClick={() => setMobile(!mobile)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-700">{mobile ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}</button></div>
      </div>
      {mobile && <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950"><div className="flex flex-col gap-2">{links.map(navLink)}{!session && <><Link onClick={() => setMobile(false)} href="/login" className="rounded-xl px-4 py-3 text-sm font-bold">Sign in</Link><Link onClick={() => setMobile(false)} href="/register" className="rounded-xl px-4 py-3 text-sm font-bold">Create account</Link></>}<Link onClick={() => setMobile(false)} href="/properties" className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white dark:bg-emerald-500 dark:text-slate-950">Browse homes</Link></div></div>}
    </nav>
  );
}
