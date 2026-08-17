'use client';

import React, { useState, useEffect } from 'react';

const LIVE_EVENTS = [
  { icon: '🛵', text: '2 940 chauffeurs & coursiers en ligne à Dakar' },
  { icon: '📦', text: '18 livraisons terminées avec succès aujourd’hui' },
  { icon: '📱', text: 'Dernière vente : iPhone 14 Pro Max à Ouakam' },
  { icon: '🌊', text: 'Nouvelle course en cours : Médina ➔ Almadies (15 min)' },
  { icon: '🐑', text: 'Bélier Ladoum royal réservé avec acompte Wave à Rufisque' },
  { icon: '🛍️', text: 'Nouveau magasin certifié : Boutique Awa Bazin (Plateau)' },
];

export function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = LIVE_EVENTS[currentIndex];

  return (
    <div className="w-full bg-[#1C3049] text-[#E8DBC8] border-b border-[#13223A] py-2 px-4 text-xs font-medium overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Indicator & Ticker */}
        <div className="flex items-center gap-2.5 truncate">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[0.68rem] tracking-wider uppercase border border-emerald-500/40 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            En direct de Dakar
          </span>

          <div className="flex items-center gap-2 truncate text-white/90 transition-all duration-500 animate-fade-in">
            <span>{current.icon}</span>
            <span className="truncate">{current.text}</span>
          </div>
        </div>

        {/* Dakar Info Stats */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-[0.72rem] text-[#C9A882]">
          <span>🇸🇳 Couverture 16 quartiers</span>
          <span className="w-1 h-1 rounded-full bg-[#C9A882]/50" />
          <span>⚡ Paiement Wave & OM</span>
        </div>
      </div>
    </div>
  );
}
