import React from 'react';

export const AdventureAwaitsCard: React.FC = () => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF4] via-[#F5FAF5] to-[#EDF5EE] border border-dashed border-[#A8C9B2]/80 p-3 overflow-hidden shadow-xs group select-none transition-all duration-300 hover:shadow-md hover:border-[#285943]/50">
      {/* Decorative Postal Stamp in Top Right */}
      <div className="absolute top-2 right-2 flex items-center justify-center w-7 h-8 bg-white border border-dashed border-[#A8C9B2] rounded shadow-2xs rotate-3 pointer-events-none">
        <div className="flex flex-col items-center">
          <svg className="w-3.5 h-3.5 text-[#285943]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z" fill="#BDE5CF" />
          </svg>
          <span className="text-[6px] font-mono font-bold text-[#285943] tracking-tighter">ROAM</span>
        </div>
      </div>

      {/* Decorative Postmark Waves */}
      <svg className="absolute top-2 right-10 w-8 h-4 opacity-30 text-[#285943] pointer-events-none" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 5 Q 10 0, 20 5 T 40 5 M0 10 Q 10 5, 20 10 T 40 10 M0 15 Q 10 10, 20 15 T 40 15" />
      </svg>

      {/* Scenic Nature Illustration (Hills, Pine Trees, Vintage Van, Mountains) */}
      <div className="relative w-full h-24 mt-1 rounded-xl overflow-hidden bg-gradient-to-b from-[#DDF1E4]/50 to-[#BDE5CF]/40">
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 220 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant Mountains */}
          <path d="M0 65 L35 42 L70 65 Z" fill="#A8C9B2" opacity="0.35" />
          <path d="M50 65 L95 32 L140 65 Z" fill="#A8C9B2" opacity="0.45" />
          <path d="M120 65 L165 38 L210 65 Z" fill="#A8C9B2" opacity="0.35" />

          {/* Morning Sun */}
          <circle cx="160" cy="22" r="9" fill="#FFFDF4" opacity="0.9" />

          {/* Little flying birds in distance */}
          <path d="M110 18 Q 113 15, 116 18 Q 119 15, 122 18" stroke="#285943" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M125 14 Q 127 12, 129 14 Q 131 12, 133 14" stroke="#285943" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Midground Rolling Hills */}
          <path d="M-10 75 Q 50 50, 120 70 T 230 65 L230 96 L-10 96 Z" fill="#A8C9B2" opacity="0.6" />
          <path d="M-10 82 Q 70 62, 150 78 T 230 75 L230 96 L-10 96 Z" fill="#8BB297" opacity="0.5" />
          
          {/* Foreground Soft Pastel Grass Hill */}
          <path d="M-10 86 Q 60 76, 130 84 T 230 82 L230 96 L-10 96 Z" fill="#DDF1E4" />

          {/* Pine Trees on the Left */}
          {/* Tree 1 (Large) */}
          <g transform="translate(8, 42)">
            <rect x="7" y="32" width="2" height="6" fill="#1C3829" />
            <polygon points="8,4 3,14 13,14" fill="#285943" />
            <polygon points="8,11 1,22 15,22" fill="#285943" />
            <polygon points="8,18 0,33 16,33" fill="#243D32" />
          </g>

          {/* Tree 2 (Mid-size) */}
          <g transform="translate(24, 48)">
            <rect x="5.5" y="26" width="1.8" height="5" fill="#1C3829" />
            <polygon points="6.5,3 2,12 11,12" fill="#3B7D5D" />
            <polygon points="6.5,9 0.5,19 12.5,19" fill="#3B7D5D" />
            <polygon points="6.5,16 -0.5,27 13.5,27" fill="#285943" />
          </g>

          {/* Tree 3 (Smaller back tree) */}
          <g transform="translate(1, 52)">
            <polygon points="5,2 1,10 9,10" fill="#4E876B" opacity="0.85" />
            <polygon points="5,8 0,18 10,18" fill="#3B7D5D" opacity="0.9" />
            <polygon points="5,15 -1,24 11,24" fill="#285943" />
          </g>

          {/* Right Side Pine Trees */}
          <g transform="translate(195, 46)">
            <rect x="6" y="28" width="1.8" height="5" fill="#1C3829" />
            <polygon points="7,3 2,13 12,13" fill="#285943" />
            <polygon points="7,10 0.5,21 13.5,21" fill="#285943" />
            <polygon points="7,17 -0.5,29 14.5,29" fill="#243D32" />
          </g>
          <g transform="translate(182, 54)">
            <polygon points="5,2 1,9 9,9" fill="#3B7D5D" opacity="0.85" />
            <polygon points="5,7 0,16 10,16" fill="#285943" />
          </g>

          {/* Small Vintage Travel Van (Camper Bus) in Center-Right */}
          <g transform="translate(100, 56) scale(0.92)" className="transition-transform duration-300 group-hover:translate-x-1">
            {/* Van Shadow */}
            <ellipse cx="28" cy="30" rx="27" ry="2.5" fill="#243D32" opacity="0.25" />

            {/* Van Body (Lower half - Mint) */}
            <path d="M5 16 C5 16, 6 27, 8 28 L48 28 C50 27, 52 23, 52 17 L5 16 Z" fill="#BDE5CF" stroke="#285943" strokeWidth="1" />
            
            {/* Van Body (Upper half - Cream) */}
            <path d="M7 16 C7 9, 12 6, 20 6 L42 6 C48 6, 51 10, 51 16 Z" fill="#FFFDF4" stroke="#285943" strokeWidth="1" />

            {/* Split Windows */}
            <rect x="11" y="8" width="8" height="6.5" rx="1" fill="#285943" opacity="0.75" />
            <rect x="22" y="8" width="10" height="6.5" rx="1" fill="#285943" opacity="0.75" />
            <rect x="35" y="8" width="12" height="6.5" rx="1" fill="#285943" opacity="0.75" />

            {/* Front Headlight & Bumper */}
            <circle cx="51" cy="22" r="2" fill="#FFFDF4" stroke="#285943" strokeWidth="0.8" />
            <rect x="49" y="25" width="4" height="2" rx="0.5" fill="#A8C9B2" stroke="#285943" strokeWidth="0.6" />
            <rect x="3" y="25" width="4" height="2" rx="0.5" fill="#A8C9B2" stroke="#285943" strokeWidth="0.6" />

            {/* Van Wheels */}
            <g transform="translate(14, 25)">
              <circle cx="3" cy="3" r="4.5" fill="#243D32" />
              <circle cx="3" cy="3" r="2.2" fill="#FFFDF4" stroke="#285943" strokeWidth="0.6" />
            </g>
            <g transform="translate(38, 25)">
              <circle cx="3" cy="3" r="4.5" fill="#243D32" />
              <circle cx="3" cy="3" r="2.2" fill="#FFFDF4" stroke="#285943" strokeWidth="0.6" />
            </g>

            {/* Roof Rack & Surfboard / Luggage */}
            <line x1="14" y1="5.5" x2="45" y2="5.5" stroke="#285943" strokeWidth="0.8" />
            <line x1="18" y1="6" x2="18" y2="4.5" stroke="#285943" strokeWidth="0.8" />
            <line x1="41" y1="6" x2="41" y2="4.5" stroke="#285943" strokeWidth="0.8" />
            {/* Retro luggage case */}
            <rect x="20" y="2.5" width="11" height="3" rx="0.5" fill="#E9E2F7" stroke="#285943" strokeWidth="0.6" />
            {/* Small yellow/mint surfboard */}
            <path d="M15 4 C24 2, 38 2, 46 4 C38 4.8, 24 4.8, 15 4 Z" fill="#FFEAA7" stroke="#285943" strokeWidth="0.6" />
          </g>
        </svg>
      </div>

      {/* Handwritten Decorative Text: "Adventure Awaits ♡" */}
      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center">
        <span 
          className="text-lg font-bold text-[#285943] tracking-wide"
          style={{ fontFamily: "'Caveat', cursive, serif" }}
        >
          Adventure Awaits ♡
        </span>
      </div>

      <p className="text-[10px] text-[#718579] text-center font-medium -mt-0.5 tracking-tight">
        Pack your memories · RoAmigos
      </p>
    </div>
  );
};
