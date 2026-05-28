'use client';

import React from 'react';
import { QuestionPaper as QuestionPaperType, DifficultyLevel } from '../../types';

interface QuestionPaperProps {
  paper: QuestionPaperType;
}

const QuestionPaperComponent: React.FC<QuestionPaperProps> = ({ paper }) => {
  return (
    <div
      className="w-full rounded-[32px] bg-white flex flex-col gap-5 p-5 md:p-10"
      style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}
    >
      {/*Paper Header*/}
      <div className="flex flex-col items-center gap-1 text-center border-b border-[#E5E5E5] pb-4">
        <h1 className="text-[16px] md:text-[22px] font-bold text-[#303030] leading-tight">
          {paper.schoolName}
        </h1>
        <p className="text-[13px] md:text-[15px] font-semibold text-[#303030]">
          Subject: {paper.subject}
        </p>
        <p className="text-[13px] md:text-[15px] font-semibold text-[#303030]">
          Class: {paper.className}
        </p>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-[12px] md:text-[13px] font-semibold text-[#303030]">
          Time Allowed: <span className="font-bold">{paper.timeAllowed}</span>
        </p>
        <p className="text-[12px] md:text-[13px] font-semibold text-[#303030]">
          Maximum Marks: <span className="font-bold">{paper.maximumMarks}</span>
        </p>
      </div>
      <p className="text-[12px] md:text-[13px] font-semibold text-[#303030] border-t border-b border-[#E5E5E5] py-3">
        {paper.generalInstruction}
      </p>

      {/* Student info*/}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] md:text-[13px] font-semibold text-[#303030] w-28 shrink-0">
            Name:
          </span>
          <div className="flex-1 border-b border-[#303030]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] md:text-[13px] font-semibold text-[#303030] w-28 shrink-0">
            Roll Number:
          </span>
          <div className="flex-1 border-b border-[#303030]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[12px] md:text-[13px] font-semibold text-[#303030] shrink-0">
              Class:
            </span>
            <div className="flex-1 border-b border-[#303030]" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[12px] md:text-[13px] font-semibold text-[#303030] shrink-0">
              Section:
            </span>
            <div className="flex-1 border-b border-[#303030]" />
          </div>
        </div>
      </div>

      {/* Sections */}
      {paper.sections.map((section, sIndex) => (
        <div key={sIndex} className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-0.5 pt-2">
            <h2 className="text-[14px] md:text-[16px] font-bold text-[#303030]">
              Section {section.sectionLabel}
            </h2>
            <p className="text-[13px] md:text-[14px] font-semibold text-[#303030]">
              {section.title}
            </p>
            <p className="text-[11px] md:text-[12px] text-[#6B6B6B] italic text-center">
              {section.instruction}
            </p>
          </div>

          <ol className="flex flex-col gap-3 list-none">
            {section.questions.map((question, qIndex) => (
              <li key={qIndex} className="flex gap-2">
                <span className="text-[12px] md:text-[13px] text-[#303030] shrink-0 pt-0.5 w-5">
                  {question.questionNumber}.
                </span>
                <div className="flex-1">
                  <p className="text-[12px] md:text-[13px] text-[#303030] leading-relaxed">
                    <span className="font-semibold">[{question.difficulty}]</span>
                    {' '}
                    {question.text}
                    {' '}
                    <span className="font-semibold">
                      [{question.marks} Mark{question.marks > 1 ? 's' : ''}]
                    </span>
                  </p>
                  {question.options && question.options.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1.5 pl-0">
                      {question.options.map((option, oIndex) => (
                        <p key={oIndex} className="text-[11px] md:text-[12px] text-[#303030]">
                          {String.fromCharCode(65 + oIndex)}. {option}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {sIndex < paper.sections.length - 1 && (
            <div className="border-b border-dashed border-[#E5E5E5] mt-2" />
          )}
        </div>
      ))}

      {/* End of paper */}
      <div className="flex items-center justify-center pt-3 border-t border-[#E5E5E5]">
        <p className="text-[12px] md:text-[13px] font-bold text-[#303030]">
          ── End of Question Paper ──
        </p>
      </div>

      {/* Answer Key */}
      {paper.answerKey && paper.answerKey.length > 0 && (
        <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E5E5]">
          <h3 className="text-[14px] md:text-[15px] font-bold text-[#303030]">
            Answer Key:
          </h3>
          <div className="flex flex-col gap-2">
            {paper.answerKey.map((item, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-[12px] md:text-[13px] font-semibold text-[#303030] w-5 shrink-0">
                  {item.questionNumber}.
                </span>
                <p className="text-[12px] md:text-[13px] text-[#303030] leading-relaxed flex-1">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPaperComponent;