import React from 'react';
import Link from 'next/link';

interface InfoBoxProps {
  heading: string;
  buttonInfo: {
    text: string;
    link: string;
  };
  children: React.ReactNode;
}

const InfoBox = ({ heading, buttonInfo, children }: InfoBoxProps) => {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-4">{heading}</h3>
      <p className="text-gray-600 mb-6">{children}</p>
      <Link 
        href={buttonInfo.link}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
};

export default InfoBox;