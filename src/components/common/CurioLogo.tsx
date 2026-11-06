import React from 'react';

interface CurioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CurioLogo: React.FC<CurioLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Brand Icon: Location Marker + Compass + Connected Orbit Nodes */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Ambient subtle mint glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#BDE5CF]/40 via-[#A8C9B2]/30 to-[#E9E2F7]/40 blur-md group-hover:blur-lg transition-all" />
        
        {/* Core Icon Badge in soft cream/white */}
        <div className="relative w-full h-full rounded-xl bg-white/95 border border-[#A8C9B2]/50 flex items-center justify-center p-1.5 shadow-sm shadow-[#A8C9B2]/20">
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Outer exploration radar circle */}
            <circle
              cx="18"
              cy="18"
              r="14"
              stroke="url(#roamigos_gradient_border)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* Interconnected People Nodes & Orbit */}
            <circle cx="18" cy="8" r="2.2" fill="#285943" />
            <circle cx="27" cy="23" r="2" fill="#A8C9B2" />
            <circle cx="9" cy="23" r="2" fill="#BDE5CF" />
            
            {/* Pin Anchor & Iris Compass */}
            <path
              d="M18 10C14.134 10 11 13.134 11 17C11 21.6 18 28 18 28C18 28 25 21.6 25 17C25 13.134 21.866 10 18 10Z"
              fill="url(#roamigos_pin_fill)"
              fillOpacity="0.95"
              stroke="#285943"
              strokeWidth="1.2"
            />
            
            {/* Center Compass Star */}
            <path
              d="M18 13.5L19.2 16.5L22.2 17.7L19.2 18.9L18 21.9L16.8 18.9L13.8 17.7L16.8 16.5L18 13.5Z"
              fill="#FFFDF4"
            />
            
            <defs>
              <linearGradient id="roamigos_gradient_border" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#285943" />
                <stop offset="0.5" stopColor="#A8C9B2" />
                <stop offset="1" stopColor="#BDE5CF" />
              </linearGradient>
              <linearGradient id="roamigos_pin_fill" x1="11" y1="10" x2="25" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#285943" />
                <stop offset="1" stopColor="#3B7D5D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Typography Brand Lockup - RoAmigos official branding */}
      <div className="flex flex-col">
        <span className={`font-display font-bold tracking-tight text-[#243D32] ${titleSizes[size]}`}>
          RoAmigos
        </span>
        {showTagline && (
          <p className="text-xs text-[#718579] tracking-normal mt-0.5 max-w-xs font-normal">
            Find your people. Discover your places. Make memories together.
          </p>
        )}
      </div>
    </div>
  );
};
