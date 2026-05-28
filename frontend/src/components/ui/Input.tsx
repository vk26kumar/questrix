'use client';

import React from 'react';

//Types
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  inputClassName?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
}

//Component
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'right',
  className = '',
  inputClassName = '',
  name,
  id,
  autoComplete,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-[14px] font-semibold text-[#303030]"
        >
          {label}
          {required && <span className="text-[#E8471A] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 flex items-center justify-center text-[#6B6B6B]">
            {icon}
          </span>
        )}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full h-[44px]
            px-4 py-2
            text-[14px] text-[#303030]
            placeholder:text-[#9B9B9B]
            bg-white
            border border-[rgba(0,0,0,0.15)]
            rounded-[12px]
            outline-none
            transition-all duration-200
            focus:border-[#303030]
            focus:ring-1 focus:ring-[rgba(0,0,0,0.10)]
            disabled:bg-[#F6F6F6]
            disabled:text-[#9B9B9B]
            disabled:cursor-not-allowed
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            ${inputClassName}
          `}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 flex items-center justify-center text-[#6B6B6B]">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Input;