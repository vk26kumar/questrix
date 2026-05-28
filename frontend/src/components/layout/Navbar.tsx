'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, ChevronLeft, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  title?: string;
  backHref?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, backHref }) => {
  const pathname = usePathname();

  const getTitle = () => {
    if (title) return title;
    if (pathname.includes('/create')) return 'Create Assignment';
    if (pathname.includes('/result')) return 'Assignment Output';
    return 'Assignment';
  };

  return (
    <header
      className="fixed top-3 z-30 flex items-center justify-between h-[56px] px-6 rounded-[16px] bg-white/75 backdrop-blur-md"
      style={{
        left: '308px',
        width: 'calc(100% - 308px - 12px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left */}
        <div className="flex items-center gap-2">
        <Link
          href={backHref || '/'}
          className="w-[36px] h-[36px] rounded-full bg-[#F6F6F6] flex items-center justify-center hover:bg-[#EFEFEF] transition-colors"
        >
          <ChevronLeft size={18} className="text-[#303030]" />
        </Link>
        <LayoutGrid size={16} className="text-[#A9A9A9]" />
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#A9A9A9',
            letterSpacing: '-0.04em',
            lineHeight: '100%',
          }}
        >
          {getTitle()}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-[36px] h-[36px] rounded-full bg-[#F6F6F6] flex items-center justify-center hover:bg-[#EFEFEF] transition-colors">
          <Bell size={20} className="text-[#303030]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4444]" />
        </button>
        <button className="flex items-center gap-2 h-[36px] px-3 rounded-full bg-[#F6F6F6] hover:bg-[#EFEFEF] transition-colors">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src="/images/avatar.jpg"
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span className="text-[13px] font-medium text-[#303030]">John Doe</span>
          <ChevronDown size={14} className="text-[#6B6B6B]" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;