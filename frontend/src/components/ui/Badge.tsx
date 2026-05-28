'use client';

import React from 'react';
import { DifficultyLevel } from '../../types';

//Types 
interface BadgeProps {
  label: string;
  variant?: 'difficulty' | 'status' | 'count';
  difficulty?: DifficultyLevel;
  className?: string;
}

//Difficulty Colors
const difficultyStyles: Record<DifficultyLevel, string> = {
  Easy: 'bg-green-50 text-green-700 border border-green-200',
  Moderate: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Challenging: 'bg-red-50 text-red-700 border border-red-200',
};

//Component
const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'status',
  difficulty,
  className = '',
}) => {
  const getStyles = () => {
    if (variant === 'difficulty' && difficulty) {
      return difficultyStyles[difficulty];
    }
    if (variant === 'count') {
      return 'bg-[#E8471A] text-white border border-transparent';
    }
    return 'bg-[#F6F6F6] text-[#303030] border border-[rgba(0,0,0,0.10)]';
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 py-0.5
        rounded-full
        text-[11px] font-medium
        leading-none
        whitespace-nowrap
        ${getStyles()}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

export default Badge;