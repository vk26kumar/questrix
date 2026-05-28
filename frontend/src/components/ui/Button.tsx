'use client';

import React from 'react';

//Types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'dark' | 'white' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

//Component
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'dark',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const variantStyles = {
    dark: `
      bg-[#181818] text-white
      border border-transparent
      hover:bg-[#2a2a2a]
      active:bg-[#0f0f0f]
      disabled:bg-[#666666]
    `,
    white: `
      bg-white text-[#303030]
      border border-[rgba(0,0,0,0.15)]
      hover:bg-[#F6F6F6]
      active:bg-[#EFEFEF]
      disabled:bg-[#F6F6F6] disabled:text-[#9B9B9B]
    `,
    primary: `
      bg-[#E8471A] text-white
      border border-transparent
      hover:bg-[#D63D15]
      active:bg-[#C23510]
      disabled:bg-[#f0957a]
    `,
    ghost: `
      bg-transparent text-[#303030]
      border border-transparent
      hover:bg-[rgba(0,0,0,0.05)]
      active:bg-[rgba(0,0,0,0.08)]
    `,
  };

  //Size Styles
  const sizeStyles = {
    sm: 'h-[36px] px-4 text-[13px] gap-[3px]',
    md: 'h-[44px] px-5 text-[14px] gap-1',
    lg: 'h-[46px] px-6 text-[14px] gap-1',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-full
        transition-all duration-200
        cursor-pointer
        select-none
        whitespace-nowrap
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {loading && (
        <span className="flex-shrink-0">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;