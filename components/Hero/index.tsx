'use client';

import HeroHeader from './HeroHeader';
import HeroSearchForm from './HeroSearchForm';
import HeroSearchButton from './HeroSearchButton';

const Hero = () => {
  return (
    <>
      <HeroHeader />
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <HeroSearchForm />
          <HeroSearchButton />
        </div>
      </div>
    </>
  );
};

export default Hero;
