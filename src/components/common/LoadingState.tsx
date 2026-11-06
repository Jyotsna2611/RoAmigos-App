import React from 'react';

interface LoadingStateProps {
  message?: string;
  variant?: 'radar' | 'skeleton';
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Scanning coordinates...',
  variant = 'radar',
  count = 3
}) => {
  if (variant === 'radar') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#BDE5CF]/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-[#A8C9B2]/60 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-[#285943] shadow-md shadow-[#285943]/40" />
        </div>
        <p className="text-sm font-medium text-[#718579] tracking-wide">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[#A8C9B2]/30 bg-white p-4 space-y-4 shadow-xs">
          <div className="h-48 rounded-xl bg-[#EDF5EE]" />
          <div className="space-y-2">
            <div className="h-4 bg-[#EDF5EE] rounded w-3/4" />
            <div className="h-3 bg-[#EDF5EE]/60 rounded w-1/2" />
          </div>
          <div className="h-8 bg-[#EDF5EE]/80 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
