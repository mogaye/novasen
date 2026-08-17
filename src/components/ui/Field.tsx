import React from 'react';

interface FieldProps {
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, error, helper, required, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#9B4A32]">*</span>}
        </span>
      </label>
      {children}
      {error && <p className="text-xs font-medium text-[#9B4A32] mt-0.5">{error}</p>}
      {helper && !error && <p className="text-xs text-[#7A6A5C] mt-0.5">{helper}</p>}
    </div>
  );
}

export const inputClass =
  'w-full min-h-[56px] px-4 py-3.5 bg-[#E8DBC8]/60 focus:bg-white text-[#2A211A] text-base rounded-[4px] border border-[#DDCDB6] focus:border-[#7A5133] focus:outline-none transition-colors placeholder:text-[#7A6A5C]/70';

export const selectClass =
  'w-full min-h-[56px] px-4 py-3.5 bg-[#E8DBC8]/60 focus:bg-white text-[#2A211A] text-base rounded-[4px] border border-[#DDCDB6] focus:border-[#7A5133] focus:outline-none transition-colors cursor-pointer appearance-none';
