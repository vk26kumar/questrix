'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Assignment } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { deleteAssignment } from '../../store/assignmentSlice';

interface AssignmentCardProps {
  assignment: Assignment;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setMenuOpen(false);
    if (confirm(`Delete "${assignment.title}"?`)) {
      dispatch(deleteAssignment(assignment._id));
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
    } catch { return dateStr; }
  };

  const resultHref = `/assignments/${assignment._id}/result`;

  return (
    <div
      className="relative flex flex-col justify-between w-full"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '20px',
        gap: '24px',
        minHeight: '126px',
        boxShadow: '0 32px 48px rgba(0,0,0,0.20), 0 16px 48px rgba(0,0,0,0.12)',
      }}
    >

      <div className="flex items-start justify-between gap-2">
        <Link
          href={assignment.status === 'completed' ? resultHref : '#'}
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#303030',
            letterSpacing: '-0.02em',
            lineHeight: '130%',
          }}
        >
          {assignment.title}
        </Link>

        {/* Kebab menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.06)] transition-colors"
          >
            <MoreVertical size={15} className="text-[#9B9B9B]" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-6 top-2 z-600 flex flex-col"
              style={{
                width: '180px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '6px',
                gap: '0px',
                boxShadow: '0 32px 48px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.20)',
              }}
            >
              <Link
                href={resultHref}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-[13px] text-[#303030] hover:bg-[#F6F6F6] transition-colors"
              >
                <Eye size={13} />
                View Assignment
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-[13px] text-[#FF3B30] hover:bg-red-50 transition-colors w-full text-left"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span style={{ fontSize: '12px', color: '#6B6B6B', letterSpacing: '-0.01em' }}>
          <span style={{ fontWeight: 600, color: '#303030' }}>Assigned on</span>
          {' : '}
          {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span style={{ fontSize: '12px', color: '#6B6B6B', letterSpacing: '-0.01em' }}>
            <span style={{ fontWeight: 600, color: '#303030' }}>Due</span>
            {' : '}
            {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;