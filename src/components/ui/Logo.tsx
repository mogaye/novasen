'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'horizontal';
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function Logo({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  withLink = true,
  href = '/accueil',
  className = '',
  onClick,
}: LogoProps) {
  const sizeMap = {
    sm: { img: 28, text: 'text-lg', sub: 'text-[9px]', box: 'w-7 h-7' },
    md: { img: 38, text: 'text-2xl sm:text-[1.65rem]', sub: 'text-[0.65rem] sm:text-[0.68rem]', box: 'w-9 h-9 sm:w-10 sm:h-10' },
    lg: { img: 48, text: 'text-3xl sm:text-4xl', sub: 'text-xs', box: 'w-12 h-12' },
    xl: { img: 64, text: 'text-4xl sm:text-5xl', sub: 'text-sm', box: 'w-16 h-16' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none transition-transform duration-200 active:scale-[0.98] ${className}`}
      onClick={onClick}
    >
      {/* Emblem Icon / Logo Image */}
      <div
        className={`relative ${currentSize.box} rounded-xl overflow-hidden shadow-xs border shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          theme === 'dark'
            ? 'border-[#C9A882]/40 bg-white/10 ring-1 ring-white/10'
            : 'border-[#DDCDB6] bg-white ring-1 ring-black/5'
        }`}
      >
        <Image
          src="/images/logo_embleme.jpg"
          alt="NovaSen Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Typography if full or horizontal */}
      {variant !== 'emblem' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-tight font-heading leading-none ${currentSize.text} ${
                theme === 'dark' ? 'text-white' : 'text-[#573721]'
              }`}
            >
              Nova
              <span
                className={
                  theme === 'dark'
                    ? 'text-[#C9A882]'
                    : 'text-[#7A5133]'
                }
              >
                Sen
              </span>
            </span>
            {variant === 'horizontal' && (
              <span className="px-1.5 py-0.5 rounded-[4px] bg-[#1C3049] text-[#E8DBC8] text-[0.65rem] font-bold uppercase tracking-wider">
                SN
              </span>
            )}
          </div>
          <span
            className={`${currentSize.sub} font-medium tracking-wide whitespace-nowrap mt-0.5 ${
              theme === 'dark' ? 'text-[#E8DBC8]/75' : 'text-[#7A6A5C]'
            }`}
          >
            Marché & Transport
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href={href} title="NovaSen • Sénégal" className="focus:outline-none shrink-0 inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
