export default function LoadingPage() {
  return <div className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-4 py-12" aria-label="Loading content" role="status">
    <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
    <div className="mt-4 h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-10 grid gap-6 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800"><div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" /><div className="space-y-3 p-5"><div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" /></div></div>)}</div>
    <span className="sr-only">Loading...</span>
  </div>;
}
