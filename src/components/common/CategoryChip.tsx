import React from 'react';
import { Compass, Mountain, Coffee, Trees, MapPin, Disc, Sparkles } from 'lucide-react';

interface CategoryChipProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
  iconName?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  count,
  active = false,
  onClick,
  iconName
}) => {
  const getIcon = () => {
    switch (iconName || label) {
      case 'Compass':
      case 'Hidden Gems':
        return <Compass className="w-3.5 h-3.5" />;
      case 'Mountain':
      case 'Adventure':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'Coffee':
      case 'Cafes':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'Trees':
      case 'Nature':
        return <Trees className="w-3.5 h-3.5" />;
      case 'MapPin':
      case 'Weekend Trips':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'Disc':
      case 'Entertainment':
        return <Disc className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BDE5CF] shadow-xs ${
        active
          ? 'bg-[#285943] text-[#FFFDF4] shadow-sm font-semibold'
          : 'bg-white text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE] border border-[#A8C9B2]/50'
      }`}
    >
      <span className={active ? 'text-[#BDE5CF]' : 'text-[#285943]'}>
        {getIcon()}
      </span>
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[11px] tabular-nums font-mono ${active ? 'text-[#DDF1E4]' : 'text-[#9BAA9F]'}`}>
          {count}
        </span>
      )}
    </button>
  );
};
