'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Plus, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { QuestionTypeConfig } from '../../types';
import {
  setFormData,
  addQuestionType,
  createAssignment,
} from '../../store/assignmentSlice';
import { setGenerating } from '../../store/uiSlice';
import FileUpload from './FileUpload';
import QuestionTypeRow from './QuestionTypeRow';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AssignmentForm: React.FC = () => {
  const router = useRouter();

const dispatch = useAppDispatch();
const formData = useAppSelector((state) => state.assignments.formData);
const formFile = useAppSelector((state) => state.assignments.formFile);
const isLoading = useAppSelector((state) => state.assignments.isLoading);
const isGenerating = useAppSelector((state) => state.ui.isGenerating);
const generationProgress = useAppSelector((state) => state.ui.generationProgress);
const generationMessage = useAppSelector((state) => state.ui.generationMessage);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.className.trim()) newErrors.className = 'Class is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.questionTypes.length === 0)
      newErrors.questionTypes = 'Add at least one question type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    dispatch(setGenerating(true));

    const payload = {
      title: formData.title,
      subject: formData.subject,
      className: formData.className,
      schoolName: formData.schoolName,
      dueDate: formData.dueDate,
      timeAllowed: formData.timeAllowed,
      questionTypes: formData.questionTypes.map(
        ({ id: _ignoredId, ...rest }: QuestionTypeConfig) => rest
      ),
      totalQuestions: formData.totalQuestions,
      totalMarks: formData.totalMarks,
      additionalInstructions: formData.additionalInstructions,
    };

    const result = await dispatch(createAssignment(payload));

    if (createAssignment.fulfilled.match(result)) {
      const data = result.payload as { assignmentId: string };
      setAssignmentId(data.assignmentId);
      pollForResult(data.assignmentId);
    } else {
      dispatch(setGenerating(false));
      alert('Failed to create assignment. Please try again.');
    }
  };

  const pollForResult = (id: string) => {
    let attempts = 0;
    const maxAttempts = 60;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}/result`);
        if (res.ok) {
          clearInterval(interval);
          dispatch(setGenerating(false));
          router.push(`/assignments/${id}/result`);
        }
      } catch {
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        dispatch(setGenerating(false));
        alert('Generation timed out. Please try again.');
      }
    }, 3000);
  };

  const filledFields = [
    formData.title,
    formData.subject,
    formData.className,
    formData.dueDate,
    formData.questionTypes.length > 0 ? 'yes' : '',
  ].filter(Boolean).length;
  const progressPct = 50;

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 px-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[rgba(0,0,0,0.08)]" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#181818]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={18} className="text-[#E8471A]" />
          </div>
        </div>
        <div className="w-64 flex flex-col gap-2">
          <div className="w-full h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#181818] rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className="text-[12px] text-[#6B6B6B]">
              {generationMessage || 'Starting AI generation...'}
            </p>
            <p className="text-[12px] font-semibold text-[#303030]">
              {generationProgress}%
            </p>
          </div>
        </div>
        <p className="text-[14px] text-[#6B6B6B] text-center">
          Generating your question paper with AI...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-1.5 bg-[#181818] rounded-full" />
        <div className="flex-1 h-1.5 bg-[rgba(0,0,0,0.06)] rounded-full" />
      </div>

      <div
        className="w-full rounded-[24px] p-6 md:p-8 flex flex-col gap-8"
        style={{
          background: 'rgba(255,255,255,0.50)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-semibold text-[#303030]">
            Assignment Details
          </h2>
          <p className="text-[14px] text-[#6B6B6B]">
            Basic information about your assignment
          </p>
        </div>

        <FileUpload currentFile={formFile} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Quiz on Electricity"
            value={formData.title}
            onChange={(e) => dispatch(setFormData({ title: e.target.value }))}
            error={errors.title}
            required
          />
          <Input
            label="Subject"
            placeholder="e.g. Science"
            value={formData.subject}
            onChange={(e) => dispatch(setFormData({ subject: e.target.value }))}
            error={errors.subject}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Class"
            placeholder="e.g. 8th"
            value={formData.className}
            onChange={(e) => dispatch(setFormData({ className: e.target.value }))}
            error={errors.className}
            required
          />
          <Input
            label="Time Allowed"
            placeholder="e.g. 45 minutes"
            value={formData.timeAllowed}
            onChange={(e) => dispatch(setFormData({ timeAllowed: e.target.value }))}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          placeholder="DD-MM-YYYY"
          value={formData.dueDate}
          onChange={(e) => dispatch(setFormData({ dueDate: e.target.value }))}
          error={errors.dueDate}
          required
        />

        <div className="flex flex-col gap-4">
          <div className="hidden md:grid grid-cols-[1fr_100px_100px_32px] gap-3">
            <span className="text-[13px] font-semibold text-black">
              Question Type
            </span>
            <span className="text-[13px] font-semibold text-black text-center">
              No. of Questions
            </span>
            <span className="text-[13px] font-semibold text-black text-center">
              Marks
            </span>
            <span />
          </div>

          {formData.questionTypes.map((qt: QuestionTypeConfig) => (
            <QuestionTypeRow
              key={qt.id}
              config={qt}
              showRemove={formData.questionTypes.length > 1}
            />
          ))}

          {errors.questionTypes && (
            <p className="text-[12px] text-red-500">{errors.questionTypes}</p>
          )}

          <button
            type="button"
            onClick={() => dispatch(addQuestionType())}
            className="flex items-center gap-2 text-[14px] font-medium text-[#303030] hover:text-[#E8471A] transition-colors w-fit"
          >
            <span className="w-6 h-6 rounded-full bg-[#181818] flex items-center justify-center">
              <Plus size={13} className="text-white" />
            </span>
            Add Question Type
          </button>

          <div className="flex justify-end gap-6 pt-2]">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[12px] text-black font-semibold">Total Questions</span>
              <span className="text-[16px] font-bold text-[#303030]">
                {formData.totalQuestions}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[12px] text-black font-semibold">Total Marks</span>
              <span className="text-[16px] font-bold text-[#303030]">
                {formData.totalMarks}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#303030]">
            Additional Information{' '}
            <span className="font-normal text-[#9B9B9B]">(For better output)</span>
          </label>
          <div className="relative">
            <textarea
              value={formData.additionalInstructions}
              onChange={(e) =>
                dispatch(setFormData({ additionalInstructions: e.target.value }))
              }
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="
                w-full px-4 py-3 pr-10
                text-[14px] text-[#303030]
                placeholder:text-[#9B9B9B]
                bg-white/25 rounded-[16px]
                border border-dashed border-[#DADADA]
                outline-none resize-none
                focus:border-[#303030] transition-colors
              "
              style={{ minHeight: '102px' }}
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 text-[#303030] hover:text-[#181818] transition-colors"
            >
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="white" size="lg" onClick={() => router.back()}>
          ← Previous
        </Button>
        <Button
          variant="dark"
          size="lg"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default AssignmentForm;