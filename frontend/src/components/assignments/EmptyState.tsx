'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-6">

      <div
        style={{
          width: '300px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <circle cx="150" cy="155" r="110" fill="#F0F0F0" opacity="0.8"/>
          <rect x="100" y="55" width="100" height="125" rx="10" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
          <rect x="115" y="72" width="50" height="8" rx="4" fill="#303030"/>
          <rect x="115" y="90" width="70" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="115" y="103" width="58" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="115" y="116" width="65" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="115" y="129" width="45" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="115" y="142" width="60" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="185" y="48" width="60" height="36" rx="8" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
          <rect x="195" y="58" width="20" height="5" rx="2.5" fill="#E5E5E5"/>
          <rect x="195" y="68" width="32" height="4" rx="2" fill="#EFEFEF"/>
          <circle cx="228" cy="60" r="5" fill="#EFEFEF"/>
          <path d="M75 95 C78 82, 92 88, 95 75" stroke="#303030" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <circle cx="172" cy="198" r="52" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
          <circle cx="162" cy="188" r="32" fill="#FFF3F0" stroke="#E8471A" strokeWidth="2.5"/>
          <line x1="150" y1="176" x2="174" y2="200" stroke="#E8471A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="174" y1="176" x2="150" y2="200" stroke="#E8471A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="187" y1="213" x2="205" y2="231" stroke="#B0B0B0" strokeWidth="5" strokeLinecap="round"/>
          <path d="M238 75 L241 84 L250 87 L241 90 L238 99 L235 90 L226 87 L235 84 Z" fill="#E8471A" opacity="0.85"/>
          <circle cx="72" cy="198" r="13" fill="#BFDBFE"/>
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 text-center" style={{ maxWidth: '486px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#303030',
            letterSpacing: '-0.04em',
          }}
        >
          No assignments yet
        </h2>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(94,94,94,0.80)',
            lineHeight: '140%',
            letterSpacing: '-0.04em',
            textAlign: 'center',
          }}
        >
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let
          AI assist with grading.
        </p>
      </div>

      {/* CTA Button*/}
      <Link
        href="/assignments/create"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: '46px',
          padding: '12px 24px',
          borderRadius: '999px',
          background: '#181818',
          border: '1.5px solid transparent',
          backgroundImage:
            'linear-gradient(#181818, #181818), linear-gradient(180deg, #FFFFFF 50%, #666666 0%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        <Plus size={15} />
        <span>Create Your First Assignment</span>
      </Link>
    </div>
  );
};

export default EmptyState;