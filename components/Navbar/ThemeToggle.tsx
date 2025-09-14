'use client';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enableDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(enableDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark, mounted]);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setIsDark((v) => !v)}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all duration-300"
    >
      {/* Icon wrapper with cross-fade */}
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}">
        {/* Sun icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm0 17.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM3 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm15 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0118 12zM5.47 5.47a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L5.47 6.53a.75.75 0 010-1.06zm10.94 10.94a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM5.47 18.53a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06L6.53 18.53a.75.75 0 01-1.06 0zm10.94-10.94a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06L16.41 8.59a.75.75 0 01-1.06 0z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}">
        {/* Moon icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;


