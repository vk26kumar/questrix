'use client';

import React from 'react';

//Types
interface LoaderProps {
  progress?: number;
  message?: string;
  fullScreen?: boolean;
}

//Component
const Loader: React.FC<LoaderProps> = ({
  progress = 0,
  message = 'Generating your question paper...',
  fullScreen = false,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-6
        ${fullScreen ? 'fixed inset-0 bg-[#EFEFEF] z-50' : 'w-full py-16'}
      `}
    >
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[rgba(0,0,0,0.08)]" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#181818] animate-spin"
          style={{ animationDuration: '0.8s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#E8471A] animate-pulse" />
        </div>
      </div>
      {progress > 0 && (
        <div className="w-64 flex flex-col gap-2">
          <div className="w-full h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#181818] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[12px] text-[#6B6B6B]">{message}</p>
            <p className="text-[12px] font-semibold text-[#303030]">
              {progress}%
            </p>
          </div>
        </div>
      )}
      {progress === 0 && (
        <p className="text-[14px] text-[#6B6B6B] text-center max-w-xs">
          {message}
        </p>
      )}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#303030]"
            style={{
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;