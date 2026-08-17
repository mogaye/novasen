'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { INITIAL_DRIVERS } from '@/lib/drivers';
import { formatCFA, formatNumber } from '@/lib/format';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  IconArrowLeft,
  IconShieldCheck,
  IconStar,
  IconPackage,
  IconCar,
  IconMapPin,
  IconClock,
  IconPhone,
  IconCheck,
  IconTrendingUp,
} from '@/components/ui/Icons';
import { ReviewsSection } from '@/components/ReviewsSection';

export default function DriverPublicProfilePage() {
  const params = useParams();
  const driverId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { drivers, driverProfile } = useApp();

  // Find driver by id, or match current user driver profile
  const allDrivers = [driverProfile, ...drivers];
  const driver = allDrivers.find((d) => String(d.id) === String(driverId)) || drivers[0];

  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  if (!driver) {
    return notFound();
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(driver.phone);
    setContactSuccess('Numéro copié dans le presse-papier !');
    setTimeout(() => setContactSuccess(null), 3000);
  };

  const encodedWhatsAppMsg = encodeURIComponent(
    `Bonjour ${driver.fullName}, je vous contacte via NovaSen pour une course/livraison à Dakar.`
  );
  const cleanWhatsAppNumber = driver.whatsapp.replace(/\s+/g, '').replace('+', '');

  return (
    <div className="min-h-screen bg-[#F2E9DC] pb-16">
      {/* 1. TOP COVER BANNER */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-[#1C3049]">
        <img
          src={driver.coverUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80'}
          alt={driver.fullName}
          className="w-full h-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C3049] via-[#1C3049]/40 to-transparent" />

        {/* Back Navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/transport"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#1C3049] text-xs font-bold shadow-md backdrop-blur-md transition-all"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Retour au transport</span>
          </Link>
        </div>

        {/* Live Availability Pill Top Right */}
        <div className="absolute top-6 right-4 sm:right-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>En service & Disponible en direct</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN PROFILE CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        <div className="bg-white rounded-[24px] border border-[#DDCDB6] p-6 sm:p-10 shadow-xl flex flex-col gap-8">
          {/* Header Row: Avatar, Identity, Ratings & Quick CTAs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DDCDB6]/70">
            {/* Left: Avatar & Names */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src={driver.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                  alt={driver.fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-[20px] object-cover border-4 border-white shadow-xl bg-[#E8DBC8]"
                />
                <div
                  className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md"
                  title="Profil certifié par NovaSen Trust & Safety"
                >
                  <IconShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#1C3049] text-white text-xs font-bold uppercase tracking-wider">
                    {driver.vehicleType === 'moto' ? '🛵 Coursier Express' : driver.vehicleType === 'camionnette' ? '🚚 Transporteur Cargo' : '🚗 Chauffeur VTC'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E8DBC8] text-[#573721] text-xs font-bold border border-[#DDCDB6] flex items-center gap-1">
                    <IconShieldCheck className="w-3.5 h-3.5 text-[#7A5133]" />
                    <span>Identité & Permis Vérifiés</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-[#1C3049]">
                  {driver.fullName}
                </h1>
                {driver.fleetName && (
                  <p className="text-sm font-semibold text-[#7A6A5C]">
                    Enseigne : <span className="text-[#573721]">{driver.fleetName}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-[#7A6A5C] pt-1">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <IconStar className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{driver.rating} / 5</span>
                    <span className="text-[#7A6A5C] font-normal">({formatNumber(driver.totalDeliveries)} missions)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconMapPin className="w-4 h-4 text-[#1C3049]" />
                    <span className="capitalize font-semibold text-[#1C3049]">Base : Dakar ({driver.baseZoneId})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Direct Contact Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3">
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodedWhatsAppMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none min-h-[48px] px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-103"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp Direct</span>
              </a>

              {/* Appel Téléphonique */}
              <a
                href={`tel:${driver.phone.replace(/\s+/g, '')}`}
                className="flex-1 sm:flex-none min-h-[48px] px-5 rounded-full bg-[#1C3049] hover:bg-[#13223A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-103"
              >
                <IconPhone className="w-4 h-4 text-[#C9A882]" />
                <span>Appeler ({driver.phone})</span>
              </a>
            </div>
          </div>

          {/* Toast feedback */}
          {contactSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-lg text-xs font-bold text-center">
              {contactSuccess}
            </div>
          )}

          {/* Grid: 3 Colonnes (Badges Sécurité, Véhicule & Équipement, Réserver) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne 1 : Sécurité & Documents vérifiés (KYC) */}
            <div className="bg-[#F2E9DC] rounded-[16px] border border-[#DDCDB6] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#DDCDB6]">
                <div className="w-8 h-8 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C3049]">Dossier Sécurité NovaSen</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">100% Validé & Conforme</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Carte Nationale d'Identité :</span>
                  <span className="font-bold text-[#1C3049] flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{driver.cniNumber}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Permis de Conduire :</span>
                  <span className="font-bold text-[#1C3049] flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{driver.driverLicenseNumber}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Carte Grise du Véhicule :</span>
                  <span className="font-bold text-[#1C3049] flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{driver.carteGriseNumber}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Assurance Professionnelle :</span>
                  <span className="font-bold text-[#1C3049] flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{driver.insuranceCompany}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#7A6A5C]">Email de contact pro :</span>
                  <span className="font-bold text-[#1C3049]">{driver.email}</span>
                </div>
              </div>
            </div>

            {/* Colonne 2 : Véhicule & Caractéristiques */}
            <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#DDCDB6]">
                <div className="w-8 h-8 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold">
                  🛵
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#573721]">Véhicule de Mission</h3>
                  <span className="text-[11px] text-[#7A6A5C]">Contrôlé et entretenu</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Modèle & Marque :</span>
                  <span className="font-bold text-[#2A211A]">{driver.vehicleModel}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Immatriculation :</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#1C3049] text-white font-mono font-bold">
                    {driver.licensePlate}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#DDCDB6]/60">
                  <span className="text-[#7A6A5C]">Services assurés :</span>
                  <span className="font-bold text-[#573721]">
                    {driver.activityTypes.passengers && driver.activityTypes.parcels
                      ? 'Passagers & Colis Express'
                      : driver.activityTypes.parcels
                      ? 'Colis Marché & Livraison'
                      : 'Courses VTC Passagers'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#7A6A5C]">Reversement marchand :</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 uppercase">
                    <span>⚡ Encaissement {driver.payoutMethod}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne 3 : CTA Réserver & Statistiques d'intervention */}
            <div className="bg-gradient-to-br from-[#1C3049] to-[#13223A] rounded-[16px] p-6 text-white flex flex-col justify-between gap-6 shadow-md">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase font-bold text-[#C9A882] tracking-wider">
                  Missions à la demande
                </span>
                <h3 className="text-xl font-bold font-heading">
                  Besoin d'une livraison ou course rapide ?
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Confiez votre trajet ou vos colis à {driver.fullName}. Prise en charge prioritaire et suivi GPS en direct.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <GlowButton
                  href={`/livraison?driverId=${driver.id}`}
                  variant="gold"
                  size="md"
                  fullWidth
                >
                  <span className="text-base">🛵</span>
                  <span>Commander avec {driver.fullName.split(' ')[0]}</span>
                </GlowButton>

                <div className="text-center text-[11px] text-[#C9A882]/90 flex items-center justify-center gap-1.5">
                  <span>⏱️ Arrivée estimée sous 5 à 15 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. REVIEWS & RATINGS */}
          <ReviewsSection
            targetId={driver.id}
            targetName={driver.fullName}
            targetType="driver"
            themeColor="#1C3049"
          />
        </div>
      </div>
    </div>
  );
}
