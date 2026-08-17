'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { IconPlus } from './ui/Icons';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setActiveService } = useApp();

  if (pathname === '/connexion') {
    return null;
  }

  const isHome = pathname === '/' || pathname === '/accueil';
  const isMarket = pathname.startsWith('/marche') || pathname.startsWith('/annonce');
  const isTransport = pathname.startsWith('/transport') || pathname.startsWith('/livraison') || pathname.startsWith('/livreur');
  const isTarifs = pathname === '/tarifs';

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F2E9DC]/98 backdrop-blur-md border-t border-[#DDCDB6] shadow-[0_-4px_25px_rgba(87,55,33,0.08)] px-2 py-1.5 flex items-center justify-around"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {/* 1. Accueil */}
      <Link
        href="/accueil"
        onClick={() => setActiveService('market')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
          isHome
            ? 'text-[#7A5133] font-bold scale-105'
            : 'text-[#7A6A5C] hover:text-[#2A211A]'
        }`}
      >
        <span className="text-lg leading-none">🏠</span>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Accueil</span>
      </Link>

      {/* 2. Marché */}
      <Link
        href="/marche"
        onClick={() => setActiveService('market')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
          isMarket
            ? 'text-[#7A5133] font-bold scale-105'
            : 'text-[#7A6A5C] hover:text-[#2A211A]'
        }`}
      >
        <span className="text-lg leading-none">🛍️</span>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Marché</span>
      </Link>

      {/* 3. Publier (Action centrale surélevée) */}
      <Link
        href="/publier"
        className="flex flex-col items-center justify-center -mt-5 flex-1 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7A5133] to-[#A3744B] text-white flex items-center justify-center shadow-lg border-2 border-[#F2E9DC] group-hover:scale-110 group-active:scale-95 transition-transform">
          <IconPlus className="w-6 h-6 text-[#F2E9DC]" />
        </div>
        <span className="text-[10px] font-bold text-[#573721] mt-0.5 tracking-tight whitespace-nowrap">
          Publier
        </span>
      </Link>

      {/* 4. Tarifs & Abonnements */}
      <Link
        href="/tarifs"
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 relative transition-all ${
          isTarifs
            ? 'text-[#7A5133] font-bold scale-105'
            : 'text-[#7A6A5C] hover:text-[#2A211A]'
        }`}
      >
        <div className="relative">
          <span className="text-lg leading-none">💳</span>
          <span className="absolute -top-1 -right-2 px-1 py-[1px] bg-[#7A5133] text-white text-[8px] font-bold rounded-full uppercase leading-none">
            Pro
          </span>
        </div>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Tarifs</span>
      </Link>

      {/* 5. Transport */}
      <Link
        href="/transport"
        onClick={() => setActiveService('transport')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
          isTransport
            ? 'text-[#1C3049] font-bold scale-105'
            : 'text-[#7A6A5C] hover:text-[#1C3049]'
        }`}
      >
        <span className="text-lg leading-none">🚗</span>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Transport</span>
      </Link>
    </nav>
  );
}
