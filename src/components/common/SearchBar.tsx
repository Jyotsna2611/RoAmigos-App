import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Where do you want to explore?',
  onFilterClick,
  showFilterButton = true,
  className = ''
}) => {
  return (
    <div className={`relative flex items-center w-full group ${className}`}>
      <div className="absolute left-4 text-[#285943] pointer-events-none group-focus-within:text-[#285943] transition-colors">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white hover:bg-[#EDF5EE]/40 focus:bg-white border border-[#A8C9B2]/60 focus:border-[#285943] rounded-2xl py-3 pl-11 pr-24 text-sm text-[#243D32] placeholder-[#9BAA9F] transition-all focus:outline-none focus:ring-2 focus:ring-[#BDE5CF]/50 shadow-xs"
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-lg text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE] transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {showFilterButton && onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#243D32] hover:text-[#285943] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/50 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#285943]" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
