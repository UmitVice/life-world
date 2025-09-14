'use client';
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react';

const AuthProvider = ({ children }:any) => {
  // Prevent dark mode flash: set initial theme before paint
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider;