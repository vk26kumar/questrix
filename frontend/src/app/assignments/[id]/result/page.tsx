'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchResult, regenerateResult } from '../../../../store/resultSlice';
import { setGenerating } from '../../../../store/uiSlice';
import Sidebar from '../../../../components/layout/Sidebar';
import Navbar from '../../../../components/layout/Navbar';
import MobileBottomNav from '../../../../components/layout/MobileBottomNav';
import AIBanner from '../../../../components/output/AIBanner';
import QuestionPaperComponent from '../../../../components/output/QuestionPaper';
import Loader from '../../../../components/ui/Loader';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params.id as string;

  const currentResult = useAppSelector((state) => state.result.currentResult);
  const isLoading = useAppSelector((state) => state.result.isLoading);
  const error = useAppSelector((state) => state.result.error);
  const isGenerating = useAppSelector((state) => state.ui.isGenerating);
  const generationProgress = useAppSelector((state) => state.ui.generationProgress);
  const generationMessage = useAppSelector((state) => state.ui.generationMessage);

  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchResult(id));
    }
  }, [dispatch, id]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    dispatch(setGenerating(true));

    const result = await dispatch(regenerateResult(id));

    if (regenerateResult.fulfilled.match(result)) {
      let attempts = 0;
      const maxAttempts = 60;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch(
            `http://localhost:5000/api/assignments/${id}/result`
          );
          if (res.ok) {
            clearInterval(interval);
            setIsRegenerating(false);
            dispatch(setGenerating(false));
            dispatch(fetchResult(id));
          }
        } catch {
        }
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setIsRegenerating(false);
          dispatch(setGenerating(false));
          alert('Regeneration timed out. Please try again.');
        }
      }, 3000);
    } else {
      setIsRegenerating(false);
      dispatch(setGenerating(false));
      alert('Failed to regenerate. Please try again.');
    }
  };
  // Generatng state
  if (isGenerating || isRegenerating) {
    return (
      <div className="min-h-screen bg-[#EFEFEF]">
        <Sidebar />
        <Navbar backHref="/assignments" title="Generating..." />
        <main className="md:ml-[304px] pt-[80px] pb-24 md:pb-12 px-3 md:pl-6 md:pr-[12px]">
          <div className="w-full py-12">
            <Loader
              progress={generationProgress}
              message={generationMessage || 'Regenerating question paper...'}
            />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  //Loading state 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF]">
        <Sidebar />
        <Navbar backHref="/assignments" title="Loading..." />
        <main className="md:ml-[304px] pt-[80px] pb-24 md:pb-12 px-3 md:pl-6 md:pr-[12px]">
          <div className="w-full py-12">
            <Loader message="Loading your question paper..." />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  //Error state
  if (error || !currentResult) {
    return (
      <div className="min-h-screen bg-[#EFEFEF]">
        <Sidebar />
        <Navbar backHref="/assignments" title="Not Found" />
          <main className="md:ml-[304px] pt-[80px] pb-24 md:pb-12 px-3 md:pl-6 md:pr-[12px]">
            <div className="w-full py-12">
            <p className="text-[16px] font-semibold text-[#303030]">
              Result not found
            </p>
            <p className="text-[13px] text-[#6B6B6B]">
              {error || 'The question paper may still be generating.'}
            </p>
            <button
              onClick={() => router.push('/assignments')}
              className="flex items-center gap-2 h-[44px] px-6 rounded-full bg-[#181818] text-white text-[14px] font-medium hover:bg-[#2a2a2a] transition-all"
            >
              Back to Assignments
            </button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const { questionPaper } = currentResult;

  //Result state
  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <Sidebar />
      <Navbar backHref="/assignments" title="Assignment Output" />
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
        <div className="flex items-center gap-2">
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #FF7950, #C0350A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="10" viewBox="0 0 16 12" fill="none">
              <path d="M1 1.5L8 10.5L15 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#303030', letterSpacing: '-0.04em' }}>VedaAI</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#303030" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4444]" />
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '999px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>J</span>
          </div>
          <button className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]">
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
            <span className="w-[18px] h-[1.5px] bg-[#303030] rounded-full block" />
          </button>
        </div>
      </div>

        <main className="md:ml-[304px] pt-[80px] pb-24 md:pb-12 px-3 md:pl-6 md:pr-[12px]">
          <div className="w-full py-6">
          <div
            className="w-full rounded-[32px] flex flex-col gap-3 p-4 md:p-5"
            style={{ background: '#5E5E5E' }}
          >
            <AIBanner
              assignmentId={id}
              subject={questionPaper.subject}
              className={questionPaper.className}
              questionPaper={questionPaper}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
            <QuestionPaperComponent paper={questionPaper} />
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}