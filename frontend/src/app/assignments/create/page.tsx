'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { resetFormData } from '../../../store/assignmentSlice';
import { resetStep } from '../../../store/uiSlice';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import MobileBottomNav from '../../../components/layout/MobileBottomNav';
import AssignmentForm from '../../../components/create/AssignmentForm';

export default function CreateAssignmentPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetFormData());
    dispatch(resetStep());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <Sidebar />

      {/* Navbar*/}
      <div className="hidden md:block">
        <Navbar backHref="/assignments" title="Create Assignment" />
      </div>
      <div
        className="md:hidden fixed z-30 flex items-center justify-between bg-white"
        style={{ top: '12px', left: '12px', right: '12px', height: '56px', borderRadius: '16px', padding: '0 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-[36px] h-[36px] rounded-full bg-[#F6F6F6] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#303030' }}>Create Assignment</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4444]" />
          </button>
          <div className="w-7 h-7 rounded-full bg-[#303030] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">J</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="md:ml-[260px] pt-[80px] pb-28 md:pb-12 px-4 md:px-6">
        <div className="max-w-[810px] mx-auto py-6">
          <div className="hidden md:flex flex-col gap-1 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <h1 className="text-[18px] font-bold text-[#303030]">
                Create Assignment
              </h1>
            </div>
            <p className="text-[13px] text-[#6B6B6B] ml-4">
              Set up a new assignment for your students
            </p>
          </div>
          <AssignmentForm />
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}