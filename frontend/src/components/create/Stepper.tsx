'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={`
        flex items-center justify-between
        w-[100px] h-[44px]
        px-2 rounded-full
        bg-white border border-[rgba(0,0,0,0.12)]
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] active:bg-[#EFEFEF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>
      <span className="text-[14px] font-semibold text-[#303030] min-w-[20px] text-center select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] active:bg-[#EFEFEF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Stepper;