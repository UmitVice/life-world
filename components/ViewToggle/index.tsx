"use client";

import React, { useCallback, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ViewMode = 'list' | 'map';

interface ViewToggleProps {
  currentView: ViewMode;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setView = useCallback(
    (view: ViewMode) => {
      if (view === currentView) return;
      const params = new URLSearchParams(searchParams.toString());
      if (view === 'list') {
        params.delete('view');
      } else {
        params.set('view', view);
      }
      const query = params.toString();
      startTransition(() => {
        router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
      });
    },
    [currentView, pathname, router, searchParams]
  );

  const baseClass =
    'px-4 py-2 rounded-md transition text-sm font-medium disabled:opacity-50';
  const activeClass = 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm';
  const inactiveClass = 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';

  return (
    <div
      role="tablist"
      aria-label="View mode"
      className={`bg-slate-200 dark:bg-slate-800 p-1 rounded-lg inline-flex ${isPending ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        role="tab"
        aria-selected={currentView === 'list'}
        onClick={() => setView('list')}
        disabled={isPending}
        className={`${baseClass} ${currentView === 'list' ? activeClass : inactiveClass}`}
      >
        📋 List
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={currentView === 'map'}
        onClick={() => setView('map')}
        disabled={isPending}
        className={`${baseClass} ${currentView === 'map' ? activeClass : inactiveClass}`}
      >
        🗺️ Map
      </button>
    </div>
  );
};

export default ViewToggle;
