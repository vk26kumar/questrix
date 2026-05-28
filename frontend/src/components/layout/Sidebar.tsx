'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  FileText,
  Wand2,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { icon: LayoutGrid, label: 'Home', href: '/' },
  { icon: Users, label: 'My Groups', href: '/groups' },
  { icon: FileText, label: 'Assignments', href: '/assignments' },
  { icon: Wand2, label: "AI Teacher's Toolkit", href: '/toolkit' },
  { icon: Clock, label: 'My Library', href: '/library' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col fixed bg-white z-40"
      style={{
        left: '12px',
        top: '12px',
        width: '280px',
        height: 'calc(100vh - 24px)',
        borderRadius: '16px',
        boxShadow: '0 32px 48px rgba(0,0,0,0.20), 0 16px 48px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex flex-col h-full px-6 py-6 gap-12">

        {/* Logo*/}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 shrink-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF7950, #C0350A)',
              borderRadius: '8px',
            }}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M1 1.5L8 10.5L15 1.5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.06em',
              color: '#303030',
            }}
          >
            VedaAI
          </span>
        </div>

        {/*Create Assignment Button*/}
        <Link
          href="/assignments/create"
          className="flex items-center justify-center gap-2 w-full shrink-0 transition-opacity hover:opacity-90"
          style={{
            height: '42px',
            borderRadius: '100px',
            backgroundImage:
              'linear-gradient(#272727, #272727), linear-gradient(135deg, #FF7950, #C0350A)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            border: '4px solid transparent',
            color: 'white',
            fontSize: '14px',
            fontWeight: 400,
            textDecoration: 'none',
          }}
        >
          <Sparkles size={14} className="shrink-0" />
          <span>Create Assignment</span>
        </Link>

        {/*Nav Items*/}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  height: '42px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isActive ? '#F0F0F0' : 'transparent',
                  color: isActive ? '#303030' : '#6B6B6B',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                <item.icon
                  size={16}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  style={{ flexShrink: 0 }}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/*Bottom*/}
        <div className="flex flex-col gap-2 shrink-0">

       
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6B6B6B',
              padding: '8px 12px',
              borderRadius: '8px',
            }}
          >
            <Settings size={16} strokeWidth={1.75} />
            <span>Settings</span>
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#F0F0F0',
              borderRadius: '16px',
              padding: '12px',
            }}
          >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#F0F0F0',
            }}
          >
            <img
              src="/images/school-logo.png"
              alt="School Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#303030',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Delhi Public School
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#6B6B6B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Bokaro Steel City
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;