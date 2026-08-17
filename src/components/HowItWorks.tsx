'use client';

import React from 'react';
import Link from 'next/link';
import { IconArrowRight, IconShieldCheck, IconPackage, IconCar } from './ui/Icons';

export function HowItWorks() {
  const STEPS = [
    {
      num: '01',
      badge: 'Étape 1',
      icon: '🛍️',
      title: 'Trouvez ou Vendez un article',
      desc: 'Explorez le catalogue de Dakar (High-tech, mode, véhicules, électroménager) ou publiez gratuitement votre annonce en 1 minute.',
      tag: 'Sans commission d’entrée',
      color: '#7A5133',
    },
    {
      num: '02',
      badge: 'Étape 2',
      icon: '🛵',
      title: 'Livraison express par coursier',
      desc: 'Un livreur certifié NovaSen récupère le colis au quartier du vendeur et vous livre à domicile en moins de 45 minutes.',
      tag: 'Suivi GPS en direct',
      color: '#1C3049',
    },
    {
      num: '03',
      badge: 'Étape 3',
      icon: '💵',
      title: 'Paiement à la réception (COD)',
      desc: 'Vérifiez votre colis devant le livreur et réglez en espèces ou via Wave / Orange Money. Zéro risque, 100% confiance.',
      tag: 'Reversement immédiat',
      color: '#573721',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-16">
      {/* Section Header */}
      <div className="text-center flex flex-col gap-3 mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DBC8] border border-[#DDCDB6] text-xs font-bold uppercase tracking-widest text-[#7A5133] mx-auto">
          <span>⚡ Parcours 100% Sécurisé à Dakar</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#2A211A] tracking-tight">
          Comment fonctionne NovaSen ?
        </h2>
        <p className="text-sm sm:text-base text-[#7A6A5C] leading-relaxed">
          Le premier écosystème dakarois qui fusionne le marché d'annonces et le réseau logistique pour sécuriser chaque transaction.
        </p>
      </div>

      {/* 3 Steps Aligned in One Perfect Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {STEPS.map((s, idx) => (
          <div
            key={`step-${s.num}`}
            className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:shadow-lg hover:border-[#7A5133] transition-all duration-300 relative group"
          >
            {/* Top Bar: Icon + Step Number */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DDCDB6]/60">
              <div className="w-14 h-14 rounded-2xl bg-[#F2E9DC] flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold uppercase text-[#7A5133] tracking-wider">
                  {s.badge}
                </span>
                <span className="text-3xl font-black font-heading text-[#1C3049] opacity-25 group-hover:opacity-100 transition-opacity">
                  {s.num}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2.5 flex-1">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[#2A211A] group-hover:text-[#7A5133] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5949] leading-relaxed">
                {s.desc}
              </p>
            </div>

            {/* Bottom Tag & Accent Line */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1C3049] bg-[#E8DBC8]/60 px-3 py-1.5 rounded-lg w-fit border border-[#DDCDB6]">
                <span>✓</span>
                <span>{s.tag}</span>
              </span>
              <div className="h-1.5 w-12 rounded-full bg-[#E8DBC8] group-hover:w-full group-hover:bg-[#7A5133] transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
