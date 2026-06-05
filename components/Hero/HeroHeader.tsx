const HeroHeader = () => {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Your dream property awaits
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Explore curated homes, apartments, and rentals across the city.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroHeader;
