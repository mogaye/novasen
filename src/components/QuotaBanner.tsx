import React from 'react';
import Link from 'next/link';
import { formatCFA } from '@/lib/format';
import { IconAlertCircle, IconStar, IconArrowRight } from './ui/Icons';

interface QuotaBannerProps {
  currentCount: number;
  maxCount: number;
  planName: string;
}

export function QuotaBanner({ currentCount, maxCount, planName }: QuotaBannerProps) {
  const isBlocked = maxCount !== -1 && currentCount >= maxCount;

  if (!isBlocked) return null;

  return (
    <div className="bg-[#E8DBC8] border-2 border-[#7A5133] rounded-[8px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center shrink-0 mt-0.5">
          <IconAlertCircle className="w-6 h-6 text-[#E8DBC8]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
              Limite d'annonces atteinte
            </span>
            <span className="text-xs bg-[#573721] text-white font-bold px-2 py-0.5 rounded">
              {currentCount} / {maxCount}
            </span>
          </div>
          <h4 className="text-lg font-bold font-heading text-[#573721]">
            Passez à la formule Boutique pour continuer à publier
          </h4>
          <p className="text-xs sm:text-sm text-[#2A211A]/80 leading-relaxed max-w-xl">
            La formule Particulier est limitée à 3 annonces actives. Avec la formule{' '}
            <strong className="text-[#573721]">Boutique (6 500 CFA / mois)</strong>, vous bénéficiez de{' '}
            <strong>30 annonces</strong>, du badge officiel <em>Boutique vérifiée</em> et d'une mise en avant offerte.
          </p>
        </div>
      </div>

      <div className="shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Link
          href="/vendeur"
          className="min-h-[48px] px-5 py-2.5 rounded-[4px] bg-[#7A5133] hover:bg-[#573721] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-[#573721] shadow-xs"
        >
          <IconStar className="w-4 h-4 text-[#E8DBC8]" />
          <span>Passer à Boutique ({formatCFA(6500)}/m)</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
