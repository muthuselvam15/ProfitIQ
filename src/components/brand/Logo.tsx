import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 border border-sky-200/40 shadow-lg shadow-sky-500/20 group`}>
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-xl bg-sky-300/20 blur-sm group-hover:bg-sky-300/35 transition-all duration-300" />

        {/* Custom SVG Logo: Stylized 'P' with upward graph inner curve */}
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6 h-5/6 relative z-10">
          {/* Main Stem of 'P' */}
          <path d="M9 7V29" stroke="url(#logo_grad_stem)" strokeWidth="3.5" strokeLinecap="round" />

          {/* Loop of 'P' expanding into upward trend graph */}
          <path
            d="M9 8H18C22.4183 8 26 11.5817 26 16C26 20.4183 22.4183 24 18 24H9"
            stroke="url(#logo_grad_loop)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Inner Upward Graph Sparkline inside the 'P' */}
          <path
            d="M11 20L15 16L18 18L24 11"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intelligence spark dot */}
          <circle cx="24" cy="11" r="2" fill="#e0f2fe" />

          <defs>
            <linearGradient id="logo_grad_stem" x1="9" y1="7" x2="9" y2="29" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="logo_grad_loop" x1="9" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7dd3fc" />
              <stop offset="1" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-[0.1em] text-white flex items-center ${textSizes[size]}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-cyan-200">PROFITIQ</span>
          </div>
        </div>
      )}
    </div>
  );
};
