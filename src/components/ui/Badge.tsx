'use client';

import React from 'react';
import { IconShieldCheck, IconStar, IconCar, IconPackage } from './Icons';

interface BadgeProps {
  variant?: 'shop' | 'featured' | 'passengers' | 'passagers' | 'parcels' | 'condition' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  switch (variant) {
    case 'shop':
      return (
        <span
          className={`inline-flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[3px] sm:rounded-[4px] bg-[#1C3049] text-white text-[0.58rem] sm:text-[0.72rem] font-bold tracking-wider uppercase border border-[#1C3049] shadow-xs ${className}`}
        >
          <IconShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#C9A882] shrink-0" />
          <span className="truncate">{children}</span>
        </span>
      );
    case 'featured':
      return (
        <span
          className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[3px] sm:rounded-[4px] bg-[#7A5133] text-white text-[0.58rem] sm:text-[0.72rem] font-bold tracking-wider uppercase border border-[#573721] shadow-xs ${className}`}
        >
          <IconStar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#E8DBC8] shrink-0" />
          <span className="truncate">{children}</span>
        </span>
      );
    case 'passengers':
    case 'passagers':
      return (
        <span
          className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-[3px] sm:rounded-[4px] bg-[#E8DBC8] text-[#1C3049] text-[0.58rem] sm:text-[0.72rem] font-semibold border border-[#DDCDB6] ${className}`}
        >
          <IconCar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#1C3049] shrink-0" />
          <span className="truncate">{children}</span>
        </span>
      );
    case 'parcels':
      return (
        <span
          className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-[3px] sm:rounded-[4px] bg-[#E8DBC8] text-[#7A5133] text-[0.58rem] sm:text-[0.72rem] font-semibold border border-[#DDCDB6] ${className}`}
        >
          <IconPackage className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#7A5133] shrink-0" />
          <span className="truncate">{children}</span>
        </span>
      );
    case 'condition':
      return (
        <span
          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-[3px] sm:rounded-[4px] bg-white text-[#573721] text-[0.58rem] sm:text-[0.72rem] font-semibold uppercase tracking-wider border border-[#DDCDB6] ${className}`}
        >
          {children}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-[3px] sm:rounded-[4px] bg-[#E8DBC8] text-[#2A211A] text-[0.58rem] sm:text-[0.72rem] font-medium border border-[#DDCDB6] ${className}`}
        >
          {children}
        </span>
      );
  }
}
