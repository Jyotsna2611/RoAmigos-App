import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[#A8C9B2]/60 bg-[#EDF5EE]/40 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#DDF1E4] border border-[#A8C9B2]/50 flex items-center justify-center text-[#285943] mb-4 shadow-xs">
        {icon || <Compass className="w-7 h-7 animate-pulse text-[#285943]" />}
      </div>
      <h4 className="font-display text-lg font-semibold text-[#243D32] tracking-tight mb-1">
        {title}
      </h4>
      <p className="text-sm text-[#718579] max-w-sm mb-5 font-normal leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
