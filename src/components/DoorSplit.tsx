'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ZoneId, PassengerClass, ParcelClass } from '@/lib/types';
import { calculateFares, calculateTripMetrics } from '@/lib/fares';
import { formatCFA, formatDistance, formatDuration } from '@/lib/format';
import {
  IconSearch,
  IconArrowRight,
  IconCar,
  IconPackage,
  IconMapPin,
  IconShieldCheck,
  IconStar,
  IconCheck,
  IconClock,
  IconTrendingUp,
} from './ui/Icons';
import { LocationSearchInput } from './ui/LocationSearchInput';
import { GlowButton } from './ui/GlowButton';

export function DoorSplit() {
  const router = useRouter();
  const { activeService, setActiveService } = useApp();

  // Active Service Tab: 'market' | 'transport'
  const [activeTab, setActiveTab] = useState<'market' | 'transport'>('market');

  // Market Search
  const [searchQuery, setSearchQuery] = useState('');

  // Transport Route Calculator
  const [originId, setOriginId] = useState<ZoneId>('plateau');
  const [originName, setOriginName] = useState('Plateau');
  const [destinationId, setDestinationId] = useState<ZoneId>('almadies');
  const [destinationName, setDestinationName] = useState('Almadies');
  const [transportType, setTransportType] = useState<'passagers' | 'colis'>('passagers');
  const [passengerClass, setPassengerClass] = useState<PassengerClass>('eco');
  const [parcelClass, setParcelClass] = useState<ParcelClass>('moto');

  // Calculate live fares for preview
  const fares = calculateFares(originId, destinationId);
  const tripMetrics = calculateTripMetrics(originId, destinationId);
  const currentFare =
    transportType === 'passagers'
      ? fares.passengerFares[passengerClass]
      : fares.parcelFares[parcelClass];

  const handleMarketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveService('market');
    if (searchQuery.trim()) {
      router.push(`/marche?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/marche');
    }
  };

  const handleTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveService('transport');
    router.push(`/transport?tab=${transportType}&from=${originId}&to=${destinationId}`);
  };

  const isMarket = activeTab === 'market';

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & PILL BADGE (Style Elux Space / Dribbble) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 gap-4">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[999px] bg-[#E8DBC8] border border-[#DDCDB6] text-[0.78rem] font-bold tracking-wider uppercase text-[#573721] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#7A5133]" />
          <span>La 1ère plateforme intégrée Marché & Logistique au Sénégal</span>
        </div>

        {/* Big Punchy Editorial Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-[#2A211A] tracking-tight leading-[1.1]">
          Achetez, vendez et faites transporter{' '}
          <span className="relative inline-block text-[#573721]">
            dans tout le Sénégal
            <svg
              className="absolute -bottom-1 left-0 w-full h-3 text-[#C9A882]"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,8 Q50,0 100,8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#7A6A5C] max-w-2xl leading-relaxed mt-1">
          Un site de petites annonces certifié et un réseau de chauffeurs et livreurs VTC qui acheminent et encaissent vos colis à domicile.
        </p>

        {/* Social Proof Avatars & Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-[#573721]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7A5133] text-white text-[0.65rem] font-bold border-2 border-white">
                DK
              </span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1C3049] text-white text-[0.65rem] font-bold border-2 border-white">
                SN
              </span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#573721] text-white text-[0.65rem] font-bold border-2 border-white">
                +40k
              </span>
            </div>
            <span className="text-[#2A211A]">Rejoint par 40 000+ utilisateurs</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#E8DBC8]/70 px-3 py-1 rounded-[999px] border border-[#DDCDB6]">
            <IconStar className="w-3.5 h-3.5 text-[#7A5133]" />
            <span>4.9 / 5 sur 14 000+ courses & livraisons</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. LE CONSOLE DASHBOARD CARD (Style Elux Space / Dribbble) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="relative bg-white rounded-[24px] border border-[#DDCDB6] shadow-xl p-4 sm:p-8 lg:p-10 transition-all z-10">
        {/* Top Control Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#DDCDB6]/70">
          <div className="flex p-1.5 rounded-[12px] bg-[#F2E9DC] border border-[#DDCDB6] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('market');
                setActiveService('market');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[9px] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isMarket
                  ? 'bg-[#7A5133] text-white shadow-md'
                  : 'text-[#7A6A5C] hover:text-[#2A211A]'
              }`}
            >
              <span className="text-base">🛍️</span>
              <span>Le Marché (Petites Annonces)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('transport');
                setActiveService('transport');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[9px] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                !isMarket
                  ? 'bg-[#1C3049] text-white shadow-md'
                  : 'text-[#7A6A5C] hover:text-[#2A211A]'
              }`}
            >
              <span className="text-base">🚗</span>
              <span>Le Transport (VTC & Colis)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-semibold">
            <span className="text-[#7A6A5C]">Garantie NovaSen :</span>
            <span className="bg-[#E8DBC8] text-[#573721] px-2.5 py-1 rounded-[6px] border border-[#DDCDB6]">
              Paiement à la livraison (COD)
            </span>
            <span className="bg-[#E8DBC8] text-[#1C3049] px-2.5 py-1 rounded-[6px] border border-[#DDCDB6]">
              Tarifs garantis sans surprise
            </span>
          </div>
        </div>

        {/* Dynamic Service Panels */}
        {isMarket ? (
          /* ─────────────────────────────────────────────────────────────── */
          /* PANEL A : LE MARCHÉ (Style Bento Card & Hero Visual) */
          /* ─────────────────────────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center animate-fade-in">
            {/* Left Search and Filter Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
                  Recherche instantanée
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721] tracking-tight">
                  Trouvez ou vendez votre article en toute sérénité
                </h2>
                <p className="text-sm text-[#7A6A5C]">
                  Plus de 184 000 annonces vérifiées. Choisissez un article, demandez sa livraison et payez uniquement lors de la réception.
                </p>
              </div>

              {/* High-Precision Search Form */}
              <form onSubmit={handleMarketSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7A6A5C]">
                    <IconSearch className="w-5 h-5 text-[#7A5133]" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Scooter Dio, iPhone 13, Toyota Corolla, Salon..."
                    className="w-full min-h-[56px] pl-12 pr-4 bg-[#F2E9DC]/70 hover:bg-[#F2E9DC] text-[#2A211A] placeholder:text-[#7A6A5C] text-sm sm:text-base rounded-[8px] border border-[#DDCDB6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7A5133] transition-all"
                  />
                </div>
                <GlowButton
                  type="submit"
                  variant="market"
                  size="md"
                  className="shrink-0"
                >
                  <span>Explorer le marché</span>
                  <IconArrowRight className="w-4 h-4 text-[#E8DBC8]" />
                </GlowButton>
              </form>

              {/* Quick Categories Bento Chips */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">
                  Catégories populaires à Dakar :
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/marche?category=vehicules"
                    className="px-3.5 py-2 rounded-[8px] bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#2A211A] text-xs font-bold border border-[#DDCDB6] transition-all hover:scale-103"
                  >
                    🏍️ Motos & VTC (Rentabilité)
                  </Link>
                  <Link
                    href="/marche?category=telephones"
                    className="px-3.5 py-2 rounded-[8px] bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#2A211A] text-xs font-bold border border-[#DDCDB6] transition-all hover:scale-103"
                  >
                    📱 Smartphones & Tablettes
                  </Link>
                  <Link
                    href="/marche?category=electronique"
                    className="px-3.5 py-2 rounded-[8px] bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#2A211A] text-xs font-bold border border-[#DDCDB6] transition-all hover:scale-103"
                  >
                    💻 Électronique & PC
                  </Link>
                  <Link
                    href="/marche?category=immobilier"
                    className="px-3.5 py-2 rounded-[8px] bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#2A211A] text-xs font-bold border border-[#DDCDB6] transition-all hover:scale-103"
                  >
                    🏡 Immobilier & Terrains
                  </Link>
                  <Link
                    href="/marche?category=maison"
                    className="px-3.5 py-2 rounded-[8px] bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#2A211A] text-xs font-bold border border-[#DDCDB6] transition-all hover:scale-103"
                  >
                    🛋️ Maison & Équipement
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Curated Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] shadow-lg h-72 sm:h-96">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/market_hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Floating Badge Top Left */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[8px] shadow-md border border-[#DDCDB6] text-xs font-bold text-[#573721] flex items-center gap-1.5">
                  <IconShieldCheck className="w-4 h-4 text-[#7A5133]" />
                  <span>Boutique Vérifiée NovaSen</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-[12px] border border-white/20 text-white flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#E8DBC8] font-medium">Boutique Tech Luxe Dakar</span>
                    <span className="text-sm font-bold">iPhone 13 Pro 128 Go</span>
                    <span className="text-xs text-white/80">Livraison express en 25 min</span>
                  </div>
                  {/* RULE OF COLOR: Dark Blue on amount */}
                  <div className="bg-white px-3 py-1.5 rounded-[8px] shadow-sm">
                    <span className="text-sm font-bold font-heading tabular-nums text-[#1C3049]">
                      340 000 F
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────── */
          /* PANEL B : LA LIVRAISON (Annuaire des Livreurs par Zone) */
          /* ─────────────────────────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center animate-fade-in">
            {/* Left Courier Search Form */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative z-30">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C3049]">
                  Livreurs Indépendants • Contact Direct
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C3049] tracking-tight">
                  Trouvez un livreur disponible dans votre quartier
                </h2>
                <p className="text-sm text-[#7A6A5C] leading-relaxed">
                  Consultez les annonces de livreurs à proximité. Convenez directement du tarif de livraison avec votre coursier par WhatsApp ou appel. 0% de commission intermédiaire.
                </p>
              </div>

              <form onSubmit={handleTransportSubmit} className="flex flex-col gap-4">
                {/* Vehicle Quick Selector */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setParcelClass('moto')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all ${
                      parcelClass === 'moto'
                        ? 'bg-[#1C3049] text-white shadow-sm'
                        : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A] border border-[#DDCDB6]'
                    }`}
                  >
                    <span>🛵 Moto Express</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setParcelClass('voiture')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all ${
                      parcelClass === 'voiture'
                        ? 'bg-[#1C3049] text-white shadow-sm'
                        : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A] border border-[#DDCDB6]'
                    }`}
                  >
                    <span>🚗 Voiture Break</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setParcelClass('camionnette')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all ${
                      parcelClass === 'camionnette'
                        ? 'bg-[#1C3049] text-white shadow-sm'
                        : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A] border border-[#DDCDB6]'
                    }`}
                  >
                    <span>🚚 Camionnette Fret</span>
                  </button>
                </div>

                {/* Location Search Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <LocationSearchInput
                    label="Quartier de départ (Expéditeur)"
                    value={originId}
                    customText={originName}
                    onChange={(id, name) => {
                      setOriginId(id);
                      setOriginName(name);
                    }}
                    placeholder="Ex: Médina, Plateau, Grand Yoff..."
                    accentColor="transport"
                  />

                  <LocationSearchInput
                    label="Quartier d'arrivée (Destinataire)"
                    value={destinationId}
                    customText={destinationName}
                    onChange={(id, name) => {
                      setDestinationId(id);
                      setDestinationName(name);
                    }}
                    placeholder="Ex: Almadies, Pikine, Rufisque..."
                    accentColor="transport"
                  />
                </div>

                {/* CTA Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#F2E9DC] rounded-[10px] border border-[#DDCDB6]">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-xl">📍</span>
                    <div>
                      <span className="text-[#7A6A5C] block">Secteur ciblé :</span>
                      <strong className="text-sm font-bold text-[#1C3049]">
                        {originName} ➔ {destinationName}
                      </strong>
                    </div>
                  </div>

                  <GlowButton
                    type="submit"
                    variant="transport"
                    size="md"
                    className="w-full sm:w-auto shrink-0"
                  >
                    <span>Voir les livreurs disponibles</span>
                    <IconArrowRight className="w-4 h-4 text-[#C9A882]" />
                  </GlowButton>
                </div>
              </form>
            </div>

            {/* Right Transport Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] shadow-lg h-72 sm:h-96">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/transport_hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Floating Badge Top Left */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[8px] shadow-md border border-[#DDCDB6] text-xs font-bold text-[#1C3049] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Livreurs certifiés & actifs</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-[12px] border border-white/20 text-white flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#E8DBC8] font-medium">Annuaire Livreurs NovaSen</span>
                    <span className="text-sm font-bold">{originName} et banlieue</span>
                    <span className="text-xs text-white/80">Tarifs libres fixés en direct</span>
                  </div>
                  <div className="bg-emerald-600 px-3 py-1.5 rounded-[8px] shadow-sm text-white text-xs font-bold">
                    0% Commission
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. TROIS PILIERS BENTO EN BAS DU HERO */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-[8px] bg-[#7A5133] text-white flex items-center justify-center shrink-0 font-bold">
            🛍️
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#573721]">Boutiques & Vendeurs Particuliers</h4>
            <p className="text-xs text-[#7A6A5C] mt-0.5">
              3 annonces gratuites, puis formules Boutique illimitées pour booster vos ventes dakarois.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-[8px] bg-[#1C3049] text-white flex items-center justify-center shrink-0 font-bold">
            📦
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1C3049]">Livraison Colis & Marchandises</h4>
            <p className="text-xs text-[#7A6A5C] mt-0.5">
              Motos, voitures ou camionnettes : expédiez vos colis partout avec paiement en direct.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-[8px] bg-[#573721] text-white flex items-center justify-center shrink-0 font-bold">
            📈
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#573721]">Simulateur de Gains Chauffeur</h4>
            <p className="text-xs text-[#7A6A5C] mt-0.5">
              Estimez vos revenus nets mensuels et découvrez le seuil d'amortissement optimal dès 13 889 F/jour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
