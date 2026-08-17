'use client';

import React from 'react';
import { DoorSplit } from '@/components/DoorSplit';
import { HowItWorks } from '@/components/HowItWorks';
import { EarningsSimulator } from '@/components/EarningsSimulator';
import { Testimonials } from '@/components/Testimonials';
import { PaymentLogos } from '@/components/PaymentLogos';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-8 animate-page-reveal">
      {/* 1. The Signature Two-Sided DoorSplit Hero (Marché & Transport avec les 2 univers & images) */}
      <DoorSplit />

      {/* 2. Comment ça marche (Guide 3 étapes Marché & Transport) */}
      <div className="animate-stagger-1">
        <HowItWorks />
      </div>

      {/* 3. Simulateur de Rentabilité Chauffeur & Livreur */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-stagger-2">
        <EarningsSimulator />
      </div>

      {/* 4. Témoignages & Avis Clients / Vendeurs / Chauffeurs */}
      <Testimonials />

      {/* 5. Moyens de paiement acceptés au Sénégal (Wave, Orange Money, Free Money, Cash) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
        <PaymentLogos />
      </div>
    </div>
  );
}
