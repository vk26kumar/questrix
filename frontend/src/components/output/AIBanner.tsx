'use client';

import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { QuestionPaper } from '../../types';
import { downloadPDF } from '../../lib/pdfExport';

interface AIBannerProps {
  assignmentId: string;
  subject?: string;
  className?: string;
  questionPaper: QuestionPaper | null;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

const AIBanner: React.FC<AIBannerProps> = ({
  assignmentId,
  subject,
  className,
  questionPaper,
  onRegenerate,
  isRegenerating = false,
}) => {
  const handleDownload = async () => {
    if (!questionPaper) return;
    try {
      await downloadPDF(
        questionPaper,
        `${subject || 'Assignment'}_${className || ''}_QuestionPaper.pdf`
      );
    } catch {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div
      className="w-full rounded-[32px] flex flex-col gap-4 p-6 md:p-8"
      style={{ background: '#181818' }}
    >
      <p className="text-[14px] text-white/80 leading-relaxed">
        Certainly!{' '}
        <span className="text-white font-medium">
          Here are customized Question Papers
        </span>{' '}
        for your{' '}
        {subject && (
          <span className="text-white font-medium">{subject} </span>
        )}
        {className && (
          <span className="text-white font-medium">Class {className} </span>
        )}
        classes. The paper has been structured with sections, difficulty
        levels, and an answer key for your convenience.
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleDownload}
          disabled={!questionPaper}
          className="flex items-center gap-2 h-[40px] px-5 rounded-full text-[13px] font-medium text-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: '1px solid rgba(255,255,255,0.30)', background: 'white' }}
        >
          <Download size={14} />
          Download as PDF
        </button>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 h-[40px] px-5 rounded-full text-[13px] font-medium text-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: '1px solid rgba(255,255,255,0.30)', background: 'white' }}
        >
          <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
};

export default AIBanner;