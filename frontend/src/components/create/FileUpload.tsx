'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setFormFile } from '../../store/assignmentSlice';

interface FileUploadProps {
  currentFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ currentFile }) => {
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
      if (!allowed.includes(file.type)) {
        alert('Only JPEG, PNG, PDF or TXT files are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB.');
        return;
      }
      dispatch(setFormFile(file));
    },
    [dispatch]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    dispatch(setFormFile(null));
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center justify-center gap-4
          w-full min-h-[202px] rounded-[16px]
          border-[1.75px] border-dashed
          transition-all duration-200 cursor-pointer
          px-8 py-6
          ${isDragging
            ? 'border-[#181818] bg-[rgba(0,0,0,0.03)]'
            : 'border-[#DADADA] bg-white'
          }
        `}
        onClick={() => !currentFile && inputRef.current?.click()}
      >
        {currentFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-white flex items-center justify-center shadow-sm">
              <FileText size={22} className="text-[#E8471A]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[14px] font-semibold text-[#303030] text-center break-all max-w-xs">
                {currentFile.name}
              </span>
              <span className="text-[12px] text-[#6B6B6B]">
                {(currentFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,0.12)] text-[12px] text-[#303030] hover:bg-[#EFEFEF] transition-colors"
            >
              <X size={12} />
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Upload size={20} className="text-[#303030]" />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[14px] font-medium text-[#303030]">
                Choose a file or drag & drop it here
              </p>
              <p className="text-[12px] text-[#9B9B9B]">
                JPEG, PNG, up to 10MB
              </p>
            </div>

            <button
              type="button"
             className="pointer-events-auto flex items-center gap-2 h-[36px] px-5 rounded-full bg-[#F6F6F6] border border-[rgba(0,0,0,0.10)] text-[13px] text-[#303030] font-medium hover:bg-[#EFEFEF] transition-colors"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Browse Files
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.txt"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      <p className="text-[12px] text-[#9B9B9B] text-center">
        Upload images of your preferred document/image
      </p>
    </div>
  );
};

export default FileUpload;