'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAssignments } from '../../store/assignmentSlice';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import EmptyState from '../../components/assignments/EmptyState';
import AssignmentCard from '../../components/assignments/AssignmentCard';

export default function AssignmentsPage() {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector((state) => state.assignments.assignments);
  const isLoading = useAppSelector((state) => state.assignments.isLoading);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <Sidebar />
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/*Mobile Top Bar */}
      <div
        className="md:hidden fixed z-30 flex items-center justify-between bg-white"
        style={{
          top: '12px',
          left: '12px',
          right: '12px',
          height: '56px',
          borderRadius: '16px',
          padding: '0 12px 0 16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* VedaAI Logo */}
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #FF7950, #C0350A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="13" height="10" viewBox="0 0 16 12" fill="none">
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
              fontSize: '16px',
              fontWeight: 700,
              color: '#303030',
              letterSpacing: '-0.04em',
            }}
          >
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#303030"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4444]" />
          </button>

          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>
              J
            </span>
          </div>

          {/* Hamburger */}
          <button className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]">
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
          </button>
        </div>
      </div>
      <div
        className="md:hidden fixed z-20 flex items-center justify-center"
        style={{
          top: '80px',
          left: '12px',
          right: '12px',
          height: '22px',
          gap: '12px',
        }}
      >
        <Link
          href="/"
          className="absolute left-0 w-6 h-6 flex items-center justify-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#303030"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#303030',
            letterSpacing: '-0.02em',
          }}
        >
          Assignments
        </span>
      </div>

      <main className="md:ml-[304px] pt-[80px] md:pt-[80px] pb-28 md:pb-8 px-3 md:px-6">
        <div className="max-w-[1100px] mx-auto">

          {isLoading ? (
            <div className="flex flex-col gap-3 mt-16 md:mt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[116px] rounded-[24px] bg-white/50 animate-pulse"
                />
              ))}
            </div>

          ) : assignments.length === 0 ? (
            <div className="mt-8">
              <EmptyState />
            </div>

          ) : (
            <div className="flex flex-col gap-4 mt-14 md:mt-4">
              <div className="hidden md:flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <h1 className="text-[18px] font-bold text-[#303030]">
                    Assignments
                  </h1>
                </div>
                <p className="text-[13px] text-[#6B6B6B]">
                  Manage and create assignments for your classes.
                </p>
              </div>

              {/*Filter + Search Bar */}
              <div
                className="flex items-center gap-3 w-full"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  height: '64px',
                }}
              >
                {/* Filter By */}
                <button className="flex items-center gap-1.5 text-[13px] text-[#303030] font-medium shrink-0 hover:opacity-70 transition-opacity">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#303030"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filter</span>
                </button>

               <div className="relative ml-auto" style={{ width: '428px' }}>
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
                  />
                  <input
                    type="text"
                    placeholder="Search Assignments"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      paddingLeft: '36px',
                      paddingRight: '16px',
                      fontSize: '13px',
                      color: '#303030',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.20)',
                      borderRadius: '100px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              {/*Assignment Cards*/}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16">
                  <p className="text-[15px] font-semibold text-[#303030]">
                    No results found
                  </p>
                  <p className="text-[13px] text-[#6B6B6B]">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {filtered.map((assignment) => (
                    <AssignmentCard
                      key={assignment._id}
                      assignment={assignment}
                    />
                  ))}
                </div>
              )}

              {/* Bottom create button*/}
              <div className="hidden md:flex justify-center pt-4">
                <Link
                  href="/assignments/create"
                  className="flex items-center gap-2 h-[46px] px-8 rounded-full bg-[#181818] text-white text-[14px] font-medium hover:bg-[#2a2a2a] transition-all"
                >
                  <Plus size={16} />
                  Create Assignment
                </Link>
              </div>

            </div>
          )}
        </div>
      </main>

      {/*Mobile FAB*/}
      <Link
        href="/assignments/create"
        className="md:hidden fixed z-40 flex items-center justify-center"
        style={{
          bottom: '96px',
          right: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '100px',
          background: '#FFFFFF',
          boxShadow: '0 32px 48px rgba(0,0,0,0.20), 0 16px 48px rgba(0,0,0,0.12)',
        }}
      >
        <Plus size={20} className="text-[#E8471A]" />
      </Link>

      {/* Mobile bottom nav*/}
      <MobileBottomNav />
    </div>
  );
}