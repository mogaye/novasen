'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SELLER_PLANS, DRIVER_PLANS, FEATURED_LISTING_PRICE, DRIVER_REGISTRATION_FEE } from '@/lib/plans';
import { formatCFA } from '@/lib/format';
import { PlanCard } from '@/components/PlanCard';
import { Button } from '@/components/ui/Button';
import { FakePaymentModal } from '@/components/FakePaymentModal';
import { LogoWave, LogoOrangeMoney, LogoCard } from '@/components/PaymentLogos';
import { useApp } from '@/context/AppContext';
import {
  IconShieldCheck,
  IconStar,
  IconCheck,
  IconTrendingUp,
  IconInfo,
  IconArrowRight,
} from '@/components/ui/Icons';

export default function PricingPage() {
  const { userPlan, setUserPlan, driverPlan, setDriverPlan, showSuccessToast } = useApp();
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{
    title: string;
    amount: number;
    description: string;
    planId: string;
    type: 'seller' | 'driver';
  } | null>(null);

  const handleSelectSellerPlan = (planId: any, price: number, name: string) => {
    if (price === 0) {
      setUserPlan(planId);
      showSuccessToast(`Formule ${name} activée avec succès !`);
    } else {
      setSelectedPlanForPayment({
        title: `Abonnement Vendeur : ${name}`,
        amount: price,
        description: `Activation mensuelle de la formule ${name} pour votre boutique.`,
        planId,
        type: 'seller',
      });
    }
  };

  const handleSelectDriverPlan = (planId: any, price: number, name: string) => {
    if (price === 0) {
      setDriverPlan(planId);
      showSuccessToast(`Formule chauffeur ${name} activée !`);
    } else {
      setSelectedPlanForPayment({
        title: `Formule Chauffeur : ${name}`,
        amount: price,
        description: `Activation de la formule ${name} pour vos courses.`,
        planId,
        type: 'driver',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-16">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
          Modèle Économique Transparent • 0% Commission
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#573721] tracking-tight">
          Grilles Tarifaires Vendeurs & Livreurs
        </h1>
        <p className="text-sm sm:text-base text-[#7A6A5C]">
          Aucun intermédiaire sur le prix de vos courses. Des forfaits clairs et transparents pour développer votre activité à Dakar et au Sénégal.
        </p>

        {/* Official Payment Gateways Supported */}
        <div className="flex items-center justify-center flex-wrap gap-4 pt-2">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#DDCDB6] shadow-xs">
            <span className="text-xs text-[#7A6A5C] font-semibold">Paiements acceptés :</span>
            <LogoWave className="h-5" />
            <LogoOrangeMoney className="h-5" />
            <LogoCard className="h-5" />
          </div>
        </div>
      </div>

      {/* 1. GRILLE VENDEURS */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DDCDB6] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#7A5133] tracking-wider mb-1">
              <span>Pour les commerçants & marchands</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
              1. Formules Vendeurs & Boutiques
            </h2>
          </div>
          <span className="text-xs text-[#7A6A5C]">Mise en avant unitaire : <strong>{formatCFA(FEATURED_LISTING_PRICE)} / 7 jours</strong></span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SELLER_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={userPlan === plan.id}
              type="seller"
              onSelect={() => handleSelectSellerPlan(plan.id, plan.price, plan.name)}
            />
          ))}
        </div>

        {/* Realism Rule Card */}
        <div className="bg-[#E8DBC8] rounded-[8px] border border-[#DDCDB6] p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center shrink-0 mt-0.5">
            <IconShieldCheck className="w-6 h-6 text-[#E8DBC8]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-base font-heading text-[#573721]">
              Règle de réalisme & équité de la commission
            </h4>
            <p className="text-xs sm:text-sm text-[#2A211A]/85 leading-relaxed">
              La commission (4% ou 6%) n'est prélevée <strong>que si la vente passe par la livraison NovaSen</strong>, puisque c'est le livreur qui encaisse les fonds. Sur une vente réglée en direct de la main à la main, la plateforme ne prélève rien (0%). C'est la garantie d'une logistique au service du commerçant.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GRILLE LIVREURS (COLIS & MARCHANDISES) */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DDCDB6] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#1C3049] tracking-wider mb-1">
              <span>Pour les livreurs indépendants & coursiers (Motos, Voitures, Camionnettes)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C3049]">
              2. Forfaits Livreurs & Coursiers Colis
            </h2>
          </div>
          <span className="text-xs text-[#7A6A5C]">Tarifs négociés librement avec vos clients • <strong>0% Commission</strong></span>
        </div>

        {/* Key Delivery Business Principle Card */}
        <div className="bg-[#1C3049]/5 border border-[#1C3049]/20 rounded-[12px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <h4 className="font-bold text-sm text-[#1C3049]">
                Liberté totale sur vos prix de livraison
              </h4>
              <p className="text-xs text-[#7A6A5C] mt-0.5 leading-relaxed">
                NovaSen ne fixe aucun prix arbitraire. C'est vous, livreur indépendant, qui convenez directement du tarif de livraison avec le vendeur ou l'acheteur. Vous payez uniquement votre pass de référencement pour être visible et recevoir des missions.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DRIVER_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={driverPlan === plan.id}
              type="driver"
              onSelect={() => handleSelectDriverPlan(plan.id, plan.price, plan.name)}
            />
          ))}
        </div>
      </section>

      {/* 3. COMPARATIF FORFAITS LIVREURS */}
      <section id="bascule" className="bg-[#1C3049] text-white rounded-[16px] border border-[#13223A] p-8 sm:p-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#C9A882] text-[#13223A] text-xs font-bold uppercase tracking-wider w-fit">
            <IconTrendingUp className="w-4 h-4" />
            <span>Comparatif Forfaits Livreurs Colis</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            Pass Journée vs Mensuel vs Annuel (0% Commission)
          </h3>
          <p className="text-sm sm:text-base text-[#E8DBC8]/90 leading-relaxed">
            Chez NovaSen, <strong>aucun pourcentage n'est prélevé</strong> sur vos courses de livraison. 100% du prix payé par vos clients vous appartient :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-[10px] border border-white/15 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C9A882] font-semibold">Pass Journée (24h)</span>
            <div className="text-2xl font-bold font-heading tabular-nums text-white">
              1 500 CFA / jour
            </div>
            <p className="text-xs text-[#E8DBC8]/80 leading-relaxed">
              Idéal pour livrer ponctuellement ou tester la plateforme sans aucun engagement.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-[10px] border border-white/15 flex flex-col gap-2 relative overflow-hidden">
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[9px] uppercase">
              Populaire
            </span>
            <span className="text-xs uppercase tracking-wider text-[#C9A882] font-semibold">Abonnement Mensuel Pro</span>
            <div className="text-2xl font-bold font-heading tabular-nums text-[#C9A882]">
              35 000 CFA / mois
            </div>
            <p className="text-xs text-[#E8DBC8]/80 leading-relaxed">
              Rentabilité maximale pour les coursiers et livreurs actifs tous les jours.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-[10px] border border-white/15 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C9A882] font-semibold">Abonnement Annuel VIP</span>
            <div className="text-2xl font-bold font-heading tabular-nums text-emerald-400">
              400 000 CFA / an
            </div>
            <p className="text-xs text-[#E8DBC8]/80 leading-relaxed">
              Économisez 20 000 F par an avec un référencement VIP prioritaire 12 mois complets.
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-5 rounded-[8px] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#C9A882]" />
            <p className="text-xs sm:text-sm text-[#E8DBC8]">
              Devenez livreur certifié NovaSen et recevez les commandes de colis directement de nos marchands.
            </p>
          </div>
          <Link href="/livreur">
            <Button variant="secondary" size="md">
              <span>Espace Livreur & Inscription</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Fake Payment Modal */}
      {selectedPlanForPayment && (
        <FakePaymentModal
          title={selectedPlanForPayment.title}
          amount={selectedPlanForPayment.amount}
          description={selectedPlanForPayment.description}
          onClose={() => setSelectedPlanForPayment(null)}
          onSuccess={() => {
            if (selectedPlanForPayment.type === 'seller') {
              setUserPlan(selectedPlanForPayment.planId as any);
            } else {
              setDriverPlan(selectedPlanForPayment.planId as any);
            }
            setSelectedPlanForPayment(null);
            showSuccessToast(`Formule ${selectedPlanForPayment.title} activée avec succès !`);
          }}
        />
      )}
    </div>
  );
}
