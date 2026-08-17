'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ZONES } from '@/lib/zones';
import { formatCFA } from '@/lib/format';
import { GoogleRouteMap } from '@/components/GoogleRouteMap';
import { Button } from '@/components/ui/Button';
import {
  IconArrowLeft,
  IconShieldCheck,
  IconPackage,
  IconPhone,
  IconCheck,
  IconClock,
  IconMapPin,
} from '@/components/ui/Icons';

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';
  const paymentTitle = searchParams.get('title') || 'Paiement';
  const orderId = Array.isArray(params?.orderId) ? params.orderId[0] : (params?.orderId as string) || 'CMD-001';
  const { activeOrder } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(3);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(12);
  const [qrVerified, setQrVerified] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const origin = activeOrder ? ZONES.find((z) => z.id === activeOrder.originId) || ZONES[1] : ZONES[1]; // Médina
  const destination = activeOrder ? ZONES.find((z) => z.id === activeOrder.destinationId) || ZONES[7] : ZONES[7]; // Almadies

  const driver = activeOrder?.driver || {
    name: 'Moussa Diouf',
    rating: 4.95,
    totalMissions: 432,
    vehicleType: 'moto' as const,
    vehicleModel: 'Honda Dio 125cc',
    licensePlate: 'DK-4829-AN',
    phone: '77 412 89 05',
    etaMinutes: estimatedMinutes,
  };

  const itemPrice = activeOrder?.itemPrice || 45000;
  const deliveryFare = activeOrder?.fare || 1850;
  const totalAmount = itemPrice + deliveryFare;

  const isSubscription = paymentTitle.toLowerCase().includes('abonnement') || paymentTitle.toLowerCase().includes('formule') || Boolean(searchParams.get('plan'));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Payment Success Alert */}
      {paymentSuccess && (
        <div className="p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-xs shrink-0">
              ✓
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-emerald-900">
                Paiement {paymentTitle} validé avec succès !
              </span>
              <span className="text-xs text-emerald-700">
                {isSubscription
                  ? 'Votre formule d\'abonnement est validée. Vos quotas et privilèges sont actifs.'
                  : 'Votre transaction PayDunya a bien été enregistrée et votre commande est prise en charge.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSubscription ? (
              <Link
                href="/compte"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap"
              >
                Aller sur Mon Compte ➔
              </Link>
            ) : (
              <span className="px-3 py-1 bg-emerald-200 text-emerald-900 text-xs font-bold rounded-lg whitespace-nowrap">
                Payé Wave / OM
              </span>
            )}
          </div>
        </div>
      )}

      {isSubscription && (
        <div className="bg-[#FAF7F2] border border-[#DDCDB6] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#573721] font-heading">
              Abonnement {paymentTitle} prêt à l&apos;emploi !
            </h2>
            <p className="text-xs text-[#7A6A5C] mt-1">
              Vous pouvez maintenant publier vos annonces ou accepter des missions de transport sans limite.
            </p>
          </div>
          <Link
            href="/compte"
            className="px-6 py-3 bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Ouvrir mon tableau de bord
          </Link>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
        <div>
          <Link
            href="/marche"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6A5C] hover:text-[#573721] mb-1"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au marché</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
            Suivi de Livraison en direct à Dakar
          </h1>
          <p className="text-xs text-[#7A6A5C]">
            Commande N° <strong className="text-[#1C3049]">{orderId || 'NOV-2026-8492'}</strong>
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-[#1C3049] text-white px-4 py-2.5 rounded-[8px] border border-[#13223A] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="text-[0.68rem] uppercase tracking-wider text-[#C9A882] block font-bold">
              Statut en cours
            </span>
            <strong className="text-xs font-bold">En route • Arrivée dans ~{estimatedMinutes} min</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Map & Live Driver */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Map Display */}
          <div className="bg-white p-3 rounded-[14px] border border-[#DDCDB6] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between px-2 pt-1 text-xs">
              <span className="font-bold text-[#573721] flex items-center gap-1.5">
                <span>📍</span>
                <span>Itinéraire : {origin.name} ➔ {destination.name}</span>
              </span>
              <span className="font-bold text-[#1C3049]">Vitesse normale • Trafic fluide</span>
            </div>

            <div className="h-72 sm:h-96 w-full rounded-[10px] overflow-hidden border border-[#DDCDB6]">
              <GoogleRouteMap
                originId={origin.id}
                destinationId={destination.id}
                mode="colis"
                vehicleType="moto"
              />
            </div>
          </div>

          {/* Assigned Driver Card */}
          <div className="bg-white rounded-[14px] border border-[#DDCDB6] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1C3049] text-[#C9A882] text-xl flex items-center justify-center font-bold shadow-xs">
                🛵
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#2A211A]">{driver.name}</h3>
                  <span className="text-[0.68rem] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ★ {driver.rating}
                  </span>
                </div>
                <p className="text-xs text-[#7A6A5C]">
                  {driver.vehicleModel} • Plaque : <strong>{driver.licensePlate}</strong>
                </p>
                <span className="text-[0.7rem] text-[#1C3049] font-medium">
                  {driver.totalMissions} livraisons certifiées NovaSen
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${driver.phone}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-[6px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <IconPhone className="w-3.5 h-3.5 text-[#C9A882]" />
                <span>Appeler Moussa</span>
              </a>
              <button
                type="button"
                onClick={() => window.open(`https://wa.me/221${driver.phone.replace(/\s/g, '')}?text=Bonjour%20Moussa,%20je%20suis%20le%20client%20pour%20la%20livraison%20NovaSen`, '_blank')}
                className="px-3.5 py-2.5 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Official Digital Receipt */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 4-Step Progress Timeline */}
          <div className="bg-white rounded-[14px] border border-[#DDCDB6] p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-sm font-heading text-[#573721] border-b border-[#DDCDB6] pb-2">
              Étapes de la livraison
            </h3>

            <div className="flex flex-col gap-4 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <strong className="text-[#573721] block">1. Commande acceptée par le vendeur</strong>
                  <span className="text-[0.7rem] text-[#7A6A5C]">12:10 • Quartier {origin.name}</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <strong className="text-[#573721] block">2. Colis inspecté et pris en charge</strong>
                  <span className="text-[0.7rem] text-[#7A6A5C]">12:22 • Coursier sur place</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1C3049] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 animate-pulse">
                  🛵
                </div>
                <div>
                  <strong className="text-[#1C3049] block">3. En cours d'acheminement</strong>
                  <span className="text-[0.7rem] text-[#7A6A5C]">En route vers {destination.name} • ~{estimatedMinutes} min</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-[#E8DBC8] text-[#7A6A5C] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <strong className="text-[#573721] block">4. Remise du colis & Encaissement Wave/Cash</strong>
                  <span className="text-[0.7rem] text-[#7A6A5C]">À votre porte</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Digital Delivery Receipt (Reçu Officiel) */}
          <div className="bg-[#FAF6F0] rounded-[14px] border-2 border-dashed border-[#C9A882] p-6 flex flex-col gap-4 shadow-xs text-xs">
            <div className="flex items-center justify-between border-b border-[#DDCDB6] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold font-heading text-sm text-[#573721]">Reçu de Livraison NovaSen</span>
                <span className="text-[0.65rem] bg-[#E8DBC8] px-2 py-0.5 rounded font-bold text-[#7A5133]">COD Sécurisé</span>
              </div>
              <span className="text-[0.7rem] text-[#7A6A5C]">Dakar, Sénégal</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Article :</span>
                <strong className="text-[#573721] truncate max-w-[180px]">
                  {activeOrder?.listingTitle || 'Article commandé'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Prix article :</span>
                <span className="font-bold tabular-nums text-[#2A211A]">{formatCFA(itemPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Frais de coursier NovaSen :</span>
                <span className="font-bold tabular-nums text-[#2A211A]">{formatCFA(deliveryFare)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DDCDB6] text-sm">
                <span className="font-bold text-[#573721]">Total à régler au livreur :</span>
                <strong className="font-bold tabular-nums text-base text-[#1C3049]">
                  {formatCFA(totalAmount)}
                </strong>
              </div>
            </div>

            {/* Verification Security QR */}
            <div className="p-3 bg-white rounded-[8px] border border-[#DDCDB6] flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.68rem] uppercase font-bold text-[#7A5133]">QR Code de réception</span>
                <p className="text-[0.7rem] text-[#7A6A5C]">Présentez ce code au livreur à l'arrivée pour valider le déballage.</p>
              </div>
              <div className="w-12 h-12 bg-[#1C3049] rounded-[6px] flex items-center justify-center text-white text-xl font-mono shrink-0 shadow-xs">
                📲
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
