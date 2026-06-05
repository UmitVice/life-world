"use client";

import React, { useTransition, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Number of adjacent pages to show on each side of the current page */
  siblingCount?: number;
}

const buildPageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] => {
  // Show all pages if total is small
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const range: (number | 'ellipsis')[] = [];

  // Always show the first page
  range.push(1);

  if (showLeftEllipsis) {
    range.push('ellipsis');
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) {
      range.push(i);
    }
  }

  if (showRightEllipsis) {
    range.push('ellipsis');
  }

  // Always show the last page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const query = params.toString();
      startTransition(() => {
        router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
      });
    },
    [currentPage, totalPages, pathname, router, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages, siblingCount);

  const baseButton =
    'inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const inactiveButton =
    'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700';
  const activeButton =
    'bg-emerald-600 text-white border border-emerald-600';

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-2 mt-8 ${isPending ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className={`${baseButton} ${inactiveButton}`}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center min-w-[40px] h-10 text-slate-500 dark:text-slate-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            disabled={isPending}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`${baseButton} ${p === currentPage ? activeButton : inactiveButton}`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className={`${baseButton} ${inactiveButton}`}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;
