'use client';

import Image from 'next/image';
import { IProperty } from '@/models/Property';
import NotFoundIcon from '@/icons/not-found.png';

interface RateDisplayProps {
  property: IProperty;
}

const RateDisplay = ({ property }: RateDisplayProps) => {
  const formatRate = (rate?: number): string | null => {
    if (!rate) return null;
    return `$${rate.toLocaleString()}`;
  };

  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4 dark:border-slate-800">
        <div className="text-slate-500 mr-2 font-semibold text-sm">Nightly</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatRate(property?.rates?.nightly)}
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4 dark:border-slate-800">
        <div className="text-slate-500 mr-2 font-semibold text-sm">Weekly</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatRate(property?.rates?.weekly)}
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-slate-200 py-4 dark:border-slate-800">
        <div className="text-slate-500 mr-2 font-semibold text-sm">Monthly</div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatRate(property?.rates?.monthly)}
        </div>
      </div>
    </div>
  );
};

export default RateDisplay;
