import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-[4px] select-none transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-center';

  const sizeStyles = {
    sm: 'min-h-[44px] px-3.5 py-2 text-[0.875rem] gap-1.5',
    md: 'min-h-[48px] px-5 py-2.5 text-[0.95rem] gap-2',
    lg: 'min-h-[56px] px-7 py-3 text-[1.05rem] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white border border-[var(--accent-dark)] active:opacity-95',
    secondary:
      'bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#2A211A] border border-[#DDCDB6]',
    outline:
      'bg-transparent hover:bg-[#E8DBC8] text-[#2A211A] border border-[#DDCDB6]',
    dark:
      'bg-[#1C3049] hover:bg-[#13223A] text-white border border-[#13223A]',
    ghost:
      'bg-transparent hover:bg-black/5 text-[#2A211A] border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
