import React from 'react';

interface RangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  formatDisplay?: (val: number) => string;
  helper?: string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  formatDisplay,
  helper,
}: RangeProps) {
  const displayVal = formatDisplay ? formatDisplay(value) : `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex items-center justify-between">
        <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
          {label}
        </label>
        <span className="text-base font-bold tabular-nums text-[#1C3049]">
          {displayVal}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[#DDCDB6] rounded-[999px] appearance-none cursor-pointer accent-[#1C3049]"
      />
      {helper && <p className="text-[0.75rem] text-[#7A6A5C]">{helper}</p>}
    </div>
  );
}
