import React from 'react';

export function LogoWave({ className = 'h-6', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Wave Official Icon */}
      <div className="w-6 h-6 rounded-full bg-[#1DC3F4] flex items-center justify-center p-0.5 shadow-xs shrink-0">
        <svg viewBox="0 0 100 100" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
          {/* Wave Penguin / Wave Silhouette */}
          <path d="M50 10 C30 10 20 25 20 45 C20 65 30 90 50 90 C70 90 80 65 80 45 C80 25 70 10 50 10 Z" fill="#1C3049" />
          <path d="M50 20 C36 20 30 32 30 48 C30 64 36 82 50 82 C64 82 70 64 70 48 C70 32 64 20 50 20 Z" fill="#FFFFFF" />
          <circle cx="43" cy="38" r="4" fill="#1C3049" />
          <circle cx="57" cy="38" r="4" fill="#1C3049" />
          <polygon points="46,45 54,45 50,54" fill="#FFB703" />
        </svg>
      </div>
      {showText && (
        <span className="font-black tracking-tight text-[#1C3049] text-xs sm:text-sm">
          wave
        </span>
      )}
    </div>
  );
}

export function LogoOrangeMoney({ className = 'h-6', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Orange Money Official Icon */}
      <div className="w-6 h-6 rounded-[4px] bg-[#FF7900] flex items-center justify-center p-1 shadow-xs shrink-0">
        <div className="w-2.5 h-2.5 bg-white rounded-xs" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-[#FF7900] text-[11px] uppercase tracking-wide">
            Orange
          </span>
          <span className="font-bold text-[#2A211A] text-[9px] uppercase tracking-wider">
            Money
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoVisa({ className = 'h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 32" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="32" rx="4" fill="#1434CB" />
      <text x="50" y="23" fill="white" fontFamily="sans-serif" fontSize="22" fontWeight="900" fontStyle="italic" textAnchor="middle" letterSpacing="1">
        VISA
      </text>
    </svg>
  );
}

export function LogoMastercard({ className = 'h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 32" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="32" rx="4" fill="#1A1F36" />
      <circle cx="42" cy="16" r="11" fill="#EB001B" />
      <circle cx="58" cy="16" r="11" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

export function LogoCard({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <LogoVisa className="h-4 sm:h-5" />
      <LogoMastercard className="h-4 sm:h-5" />
    </div>
  );
}

export function PaymentLogos({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#DDCDB6] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}>
      <div className="flex flex-col text-center md:text-left gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
          Transactions 100% Sécurisées au Sénégal
        </span>
        <h4 className="text-base font-bold font-heading text-[#2A211A]">
          Payez à la livraison ou par Mobile Money instantané
        </h4>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#DDCDB6] flex items-center shadow-2xs">
          <LogoWave className="h-6" />
        </div>
        <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#DDCDB6] flex items-center shadow-2xs">
          <LogoOrangeMoney className="h-6" />
        </div>
        <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#DDCDB6] flex items-center shadow-2xs">
          <LogoCard className="h-6" />
        </div>
        <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#DDCDB6] flex items-center gap-2 text-xs font-bold text-[#1C3049] shadow-2xs">
          <span>💵 Espèces à la livraison (COD)</span>
        </div>
      </div>
    </div>
  );
}
