import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-24 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-900 dark:text-white font-bold text-lg">Life World</div>
          <ul className="flex items-center gap-6 text-slate-700 dark:text-slate-300">
            <li>
              <Link className="hover:text-slate-900" href="/properties">Properties</Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate-500 mt-6 text-center">
          &copy; {currentYear} Life World. Built by Umit Vice.
        </p>
      </div>
    </footer>
  )
}

export default Footer;