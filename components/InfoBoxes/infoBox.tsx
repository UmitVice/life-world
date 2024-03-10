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
    backgroundColor = 'bg-green-600',
    heading,
    textColor = 'text-white',
    buttonInfo,
    children
}) => {
  return (
    <div className={`${backgroundColor} p-4 rounded-lg shadow-md`}>
    <h2 className={`${textColor} text-2xl font-bold`}>{ heading }</h2>
    <Link
      href={buttonInfo.link}
      className={` text-2xl font-bold inline-block rounded-lg px-2 py-2 my-2 text-white hover:text-yellow-200
      hover:underline`}
    >
      {buttonInfo.text}
    </Link>
    <p className={`${textColor}`}>
        {children}
    </p>
    </div>
  )
}

export default InfoBox;