'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BookOpen, Sparkles } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: FileText, label: 'Assignments', href: '/assignments' },
  { icon: BookOpen, label: 'Library', href: '/library' },
  { icon: Sparkles, label: 'AI Toolkit', href: '/toolkit' },
];

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed z-50 flex items-center justify-between"
      style={{
        bottom: '12px',
        left: '12px',
        right: '12px',
        height: '72px',
        borderRadius: '24px',
        background: '#181818',
        padding: '8px 24px',
        boxShadow: '0 32px 48px rgba(0,0,0,0.20), 0 16px 48px rgba(0,0,0,0.12)',
      }}
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '26px',
              gap: '4px',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <item.icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.75}
              color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)'}
            />
            <span
              style={{
                fontSize: '10px',
                lineHeight: '1',
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;