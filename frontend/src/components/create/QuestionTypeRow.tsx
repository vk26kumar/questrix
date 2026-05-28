'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { removeQuestionType, updateQuestionType } from '../../store/assignmentSlice';
import { QuestionTypeConfig, QUESTION_TYPES, QuestionType } from '../../types';
import Stepper from './Stepper';

interface QuestionTypeRowProps {
  config: QuestionTypeConfig;
  showRemove?: boolean;
}

const QuestionTypeRow: React.FC<QuestionTypeRowProps> = ({ config, showRemove = true }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateQuestionType({ id: config.id, updates: { type: e.target.value as QuestionType } }));
  };

  return (
    <>
      {/*DESKTOP layout*/}
      <div className="hidden md:flex items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <select
            value={config.type}
            onChange={handleTypeChange}
            className="w-full h-[44px] pl-4 pr-10 text-[14px] text-[#303030] bg-white border border-[rgba(0,0,0,0.12)] rounded-[12px] outline-none appearance-none cursor-pointer focus:border-[#303030] transition-colors"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt} value={qt}>{qt}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
            <ChevronDown size={15} />
          </span>
        </div>
        <div className="shrink-0">
          <Stepper
            value={config.numberOfQuestions}
            onChange={(v) => dispatch(updateQuestionType({ id: config.id, updates: { numberOfQuestions: v } }))}
            min={1} max={50}
          />
        </div>
        <div className="shrink-0">
          <Stepper
            value={config.marksPerQuestion}
            onChange={(v) => dispatch(updateQuestionType({ id: config.id, updates: { marksPerQuestion: v } }))}
            min={1} max={20}
          />
        </div>
        {showRemove && (
          <button
            type="button"
            onClick={() => dispatch(removeQuestionType(config.id))}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#9B9B9B] hover:bg-red-50 hover:text-[#FF3B30] transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/*MOBILE layout*/}
      <div
        className="md:hidden flex flex-col gap-3 w-full rounded-[16px] p-3"
        style={{ background: '#F0F0F0' }}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={config.type}
              onChange={handleTypeChange}
              className="w-full h-[44px] pl-4 pr-10 text-[14px] text-[#303030] bg-white border border-[rgba(0,0,0,0.08)] rounded-[12px] outline-none appearance-none cursor-pointer"
            >
              {QUESTION_TYPES.map((qt) => (
                <option key={qt} value={qt}>{qt}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]">
              <ChevronDown size={15} />
            </span>
          </div>
          {showRemove && (
            <button
              type="button"
              onClick={() => dispatch(removeQuestionType(config.id))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#9B9B9B] shrink-0"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <div
          className="flex items-center rounded-[24px]"
          style={{ background: 'white', padding: '8px 12px', gap: '12px' }}
        >
          <div className="flex flex-col items-start gap-1 flex-1">
            <span className="text-[11px] text-[#9B9B9B] font-medium pl-1">
              No. of Questions
            </span>
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => dispatch(updateQuestionType({
                  id: config.id,
                  updates: { numberOfQuestions: Math.max(1, config.numberOfQuestions - 1) }
                }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] text-lg"
              >
                −
              </button>
              <span className="text-[15px] font-semibold text-[#303030]">
                {config.numberOfQuestions}
              </span>
              <button
                type="button"
                onClick={() => dispatch(updateQuestionType({
                  id: config.id,
                  updates: { numberOfQuestions: Math.min(50, config.numberOfQuestions + 1) }
                }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="w-px self-stretch bg-[rgba(0,0,0,0.08)]" />
          <div className="flex flex-col items-start gap-1 flex-1">
            <span className="text-[11px] text-[#9B9B9B] font-medium pl-1">
              Marks
            </span>
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => dispatch(updateQuestionType({
                  id: config.id,
                  updates: { marksPerQuestion: Math.max(1, config.marksPerQuestion - 1) }
                }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] text-lg"
              >
                −
              </button>
              <span className="text-[15px] font-semibold text-[#303030]">
                {config.marksPerQuestion}
              </span>
              <button
                type="button"
                onClick={() => dispatch(updateQuestionType({
                  id: config.id,
                  updates: { marksPerQuestion: Math.min(20, config.marksPerQuestion + 1) }
                }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#303030] hover:bg-[#F6F6F6] text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionTypeRow;