'use client';

import React from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Log on the client so dev tools and error monitoring services can
  // pick it up. The `digest` is a server-generated hash (when applicable)
  // that helps correlate client crashes with server logs.
  React.useEffect(() => {
    console.error('Client error boundary caught:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors"
    >
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
          <svg
            className="h-6 w-6 text-rose-600 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          We hit an unexpected error. You can try again, or head back home.
        </p>

        {error.message && (
          <pre className="text-left text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg overflow-auto mb-6 max-h-40">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ''}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
