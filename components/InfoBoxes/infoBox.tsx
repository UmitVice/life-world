import React from 'react';
import Link from 'next/link';

interface ButtonInfo {
  link: string;
  backgroundColor?: string;
  text: string;
}

interface InfoBoxProps {
  backgroundColor?: string;
  heading?: string;
  textColor?: string;
  buttonInfo: ButtonInfo;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  backgroundColor = 'bg-white',
  heading,
  textColor = 'text-slate-700',
  buttonInfo,
  children,
}) => {
  return (
    <div className={`${backgroundColor} rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-sm p-6 transition-colors`}> 
      {heading && (
        <h2 className={`text-xl md:text-2xl font-semibold ${textColor}`}>{heading}</h2>
      )}
      <p className={`mt-3 text-slate-600`}>{children}</p>
      <Link
        href={buttonInfo.link}
        className="inline-flex items-center mt-5 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition"
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
}

export default InfoBox;