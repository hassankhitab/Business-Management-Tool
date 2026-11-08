import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`relative flex items-center justify-center font-black rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-white shadow-md shadow-orange-600/25 shrink-0 ${sizeMap[size]} ${className}`}
    >
      <span className="tracking-tight font-extrabold select-none">JB</span>
      {/* Small construction crane / girder accent icon in corner */}
      <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-amber-400/50 shadow-xs">
        <svg
          className={`${iconSizes[size]} text-amber-400`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Construction crane silhouette */}
          <path d="M4 22h16" />
          <path d="M7 22V6l6-4h7" />
          <path d="M13 2v6" />
          <path d="M20 2v8l-2 2" />
          <path d="M7 11h6" />
        </svg>
      </div>
    </div>
  );
};
