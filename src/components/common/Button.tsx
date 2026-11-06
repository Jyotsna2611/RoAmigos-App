import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285943]/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer whitespace-nowrap';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
  };

  const variantStyles = {
    primary: 'bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-semibold shadow-sm hover:shadow border border-[#A8C9B2]/60',
    secondary: 'bg-[#EDF5EE] hover:bg-[#DDF1E4] text-[#243D32] border border-[#A8C9B2]/40 shadow-xs',
    glass: 'bg-white/90 hover:bg-white text-[#243D32] border border-[#A8C9B2]/40 shadow-xs',
    ghost: 'bg-transparent hover:bg-[#EDF5EE] text-[#718579] hover:text-[#243D32]',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
