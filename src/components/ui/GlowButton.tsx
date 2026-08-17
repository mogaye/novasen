'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'market' | 'transport' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function GlowButton({
  children,
  href,
  onClick,
  variant = 'market',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
}: GlowButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHover: boolean }>({
    x: 50,
    y: 50,
    isHover: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, isHover: true });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHover: false }));
  };

  const sizeClasses = {
    sm: 'min-h-[42px] px-4 py-1.5 text-xs',
    md: 'min-h-[48px] px-6 py-2.5 text-sm',
    lg: 'min-h-[56px] px-8 py-3.5 text-base',
  };

  const variantInnerBg = {
    market: 'bg-gradient-to-r from-[#573721] via-[#7A5133] to-[#573721] text-white',
    transport: 'bg-gradient-to-r from-[#13223A] via-[#1C3049] to-[#13223A] text-white',
    gold: 'bg-gradient-to-r from-[#7A5133] via-[#C9A882] to-[#7A5133] text-[#1C3049] font-bold',
  };

  const innerContent = (
    <div
      className={`relative z-10 w-full h-full rounded-full flex items-center justify-center gap-2 font-bold tracking-wide select-none overflow-hidden transition-all duration-300 shadow-sm whitespace-nowrap ${variantInnerBg[variant]} ${sizeClasses[size]}`}
    >
      {/* Interactive mouse reflection spotlight (Aaron Iker style) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: mousePos.isHover ? 0.35 : 0,
          background: `radial-gradient(circle 80px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.8), transparent 80%)`,
        }}
      />

      {/* Subtle top edge specular highlight line */}
      <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-xs whitespace-nowrap">{children}</span>
    </div>
  );

  const containerClasses = `glow-btn-root ${fullWidth ? 'w-full flex' : 'inline-flex'} ${className} ${
    disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer'
  }`;

  if (href) {
    return (
      <div
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={containerClasses}
      >
        <Link href={href} className="w-full block focus:outline-none">
          {innerContent}
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={containerClasses}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="w-full h-full bg-transparent border-0 p-0 m-0 focus:outline-none cursor-pointer"
      >
        {innerContent}
      </button>
    </div>
  );
}
