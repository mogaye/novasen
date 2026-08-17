'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ZONES } from '@/lib/zones';
import { Button } from '@/components/ui/Button';
import {
  IconPackage,
  IconShieldCheck,
  IconPhone,
  IconArrowRight,
  IconSearch,
  IconStar,
  IconMapPin,
  IconCheck,
} from '@/components/ui/Icons';

export interface CourierListing {
  id: string;
  name: string;
  avatar: string;
  zone: string;
  city: string;
  vehicleType: 'moto' | 'voiture' | 'camionnette';
  vehicleLabel: string;
  vehicleModel: string;
  description: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  pricingNote: string;
  isVerified: boolean;
  isOnline: boolean;
  planBadge: string;
}

const COURIER_LISTINGS: CourierListing[] = [
  {
    id: 'c-1',
    name: 'Ousmane Ba Express',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    zone: 'Médina / Plateau / Fann',
    city: 'Dakar',
    vehicleType: 'moto',
    vehicleLabel: '🛵 Moto Express',
    vehicleModel: 'Honda Dio 110cc (Top-case sécurisé)',
    description: 'Coursier rapide et fiable pour vos plis, repas, téléphones et petits colis. Disponible 7j/7 sur tout le centre-ville et Corniche.',
    phone: '+221 77 645 28 19',
    whatsapp: '+221 77 645 28 19',
    rating: 4.95,
    reviewsCount: 142,
    pricingNote: 'Tarif convenu en direct selon distance',
    isVerified: true,
    isOnline: true,
    planBadge: 'Abonné Pro',
  },
  {
    name: 'Cheikhna Ndiaye & Fils',
    id: 'c-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    zone: 'Grand Yoff / VDN / Liberté 6',
    city: 'Dakar',
    vehicleType: 'voiture',
    vehicleLabel: '🚗 Voiture Break',
    vehicleModel: 'Peugeot 301 Break (Grand Coffre)',
    description: 'Livraison de cartons volumineux, télévisions, vêtements en gros et petit électroménager. Expérience de 5 ans sur Dakar.',
    phone: '+221 78 412 90 33',
    whatsapp: '+221 78 412 90 33',
    rating: 4.9,
    reviewsCount: 98,
    pricingNote: 'Prix libre fixé avec le client',
    isVerified: true,
    isOnline: true,
    planBadge: 'Abonné Annuel VIP',
  },
  {
    id: 'c-3',
    name: 'Moussa Sow Logistique Fret',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    zone: 'Pikine / Guédiawaye / Thiaroye',
    city: 'Dakar Banlieue',
    vehicleType: 'camionnette',
    vehicleLabel: '🚚 Camionnette Fret',
    vehicleModel: 'Toyota HiAce Fourgonnette 1.5 Tonne',
    description: 'Spécialiste déménagements, transport de meubles, sacs de riz, matériaux de construction et marchandises lourdes marchandes.',
    phone: '+221 76 304 88 12',
    whatsapp: '+221 76 304 88 12',
    rating: 4.88,
    reviewsCount: 76,
    pricingNote: 'Devis direct selon le volume',
    isVerified: true,
    isOnline: true,
    planBadge: 'Abonné Pro',
  },
  {
    id: 'c-4',
    name: 'Amadou Diallo Coursier',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    zone: 'Almadies / Ngor / Ouakam',
    city: 'Dakar',
    vehicleType: 'moto',
    vehicleLabel: '🛵 Moto Express',
    vehicleModel: 'Yamaha Crypton 115',
    description: 'Courses urgentes pour boutiques en ligne, cosmétiques, bijoux et documents confidentiels. Ponctualité garantie.',
    phone: '+221 77 123 45 67',
    whatsapp: '+221 77 123 45 67',
    rating: 4.92,
    reviewsCount: 110,
    pricingNote: 'Tarif convenu avec le vendeur/client',
    isVerified: true,
    isOnline: true,
    planBadge: 'Pass Journée',
  },
  {
    id: 'c-5',
    name: 'Samba Ba Transport',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    zone: 'Rufisque / Bargny / Diamniadio',
    city: 'Rufisque',
    vehicleType: 'voiture',
    vehicleLabel: '🚗 Voiture Break',
    vehicleModel: 'Renault Duster 4x4',
    description: 'Liaisons régulières Dakar - Diamniadio - Rufisque. Prise en charge de colis fragiles et livraisons marchandes sécurisées.',
    phone: '+221 78 888 21 00',
    whatsapp: '+221 78 888 21 00',
    rating: 4.85,
    reviewsCount: 64,
    pricingNote: 'Prix fixé en direct par WhatsApp',
    isVerified: true,
    isOnline: false,
    planBadge: 'Abonné Pro',
  },
  {
    id: 'c-6',
    name: 'Babacar Diop Fret & Livraison',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    zone: 'Mbour / Saly / Somone',
    city: 'Thiès & Petite Côte',
    vehicleType: 'camionnette',
    vehicleLabel: '🚚 Pickup 4x4',
    vehicleModel: 'Mitsubishi L200 Plateau',
    description: 'Transport de marchandises et bagages sur l’axe Dakar - Mbour - Saly. Tarifs directs sans intermédiaire.',
    phone: '+221 77 901 12 34',
    whatsapp: '+221 77 901 12 34',
    rating: 4.97,
    reviewsCount: 89,
    pricingNote: 'Tarif convenu librement avec le client',
    isVerified: true,
    isOnline: true,
    planBadge: 'Abonné Annuel VIP',
  },
];

function TransportContent() {
  const searchParams = useSearchParams();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<'all' | 'moto' | 'voiture' | 'camionnette'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCouriers = COURIER_LISTINGS.filter((courier) => {
    // Filter by vehicle
    if (selectedVehicle !== 'all' && courier.vehicleType !== selectedVehicle) {
      return false;
    }
    // Filter by zone
    if (selectedZone !== 'all') {
      const matchZone = courier.zone.toLowerCase().includes(selectedZone.toLowerCase()) || courier.city.toLowerCase().includes(selectedZone.toLowerCase());
      if (!matchZone) return false;
    }
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        courier.name.toLowerCase().includes(q) ||
        courier.zone.toLowerCase().includes(q) ||
        courier.city.toLowerCase().includes(q) ||
        courier.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 animate-page-reveal">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DDCDB6] animate-stagger-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
            Réseau Logistique Indépendant • Colis & Marchandises
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#1C3049] tracking-tight mt-1">
            Trouvez un livreur dans votre zone
          </h1>
          <p className="text-sm sm:text-base text-[#7A6A5C] mt-2 max-w-2xl leading-relaxed">
            Consultez les annonces des livreurs et coursiers indépendants de votre quartier. Contactez-les directement par téléphone ou WhatsApp pour convenir ensemble du prix de votre livraison.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/tarifs#bascule">
            <span className="px-4 py-2.5 rounded-[8px] bg-[#FAF8F5] border border-[#DDCDB6] hover:bg-[#E8DBC8] text-[#573721] text-xs font-bold transition-all inline-flex items-center gap-1.5">
              <span>💳 Forfaits Livreurs (0% commission)</span>
            </span>
          </Link>
          <Link href="/livreur">
            <Button variant="primary" size="md" className="shadow-md">
              <span>Publier mon annonce livreur</span>
              <IconArrowRight className="w-4 h-4 text-[#E8DBC8]" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Principle Banner (No automatic fare calculation) */}
      <div className="bg-[#1C3049] text-white p-6 rounded-[16px] border border-[#13223A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C9A882] text-[#1C3049] flex items-center justify-center font-bold shrink-0 text-2xl shadow-inner">
            🤝
          </div>
          <div>
            <h3 className="font-bold text-lg font-heading text-white">
              Liberté de négociation en direct : 0 intermédiaire sur les prix
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DBC8]/90 mt-1 leading-relaxed max-w-3xl">
              NovaSen ne fixe aucun prix et ne prélève <strong>aucune commission (0%)</strong> sur vos livraisons. Vous vous accordez directement avec le livreur sur la somme à payer pour acheminer votre colis.
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white/10 px-4 py-2 rounded-xl border border-white/15 text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#C9A882] font-bold block">Forfaits Livreurs</span>
          <span className="text-xs font-semibold text-white">1 500 F/j • 35 000 F/mois • 400 000 F/an</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-5 sm:p-6 shadow-xs flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <label className="text-xs font-bold uppercase text-[#7A6A5C] tracking-wide block mb-1.5">
              Recherche par mot-clé ou quartier
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: Médina, Pikine, Moto, Plateau, Cartons..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3049]"
              />
              <IconSearch className="w-4 h-4 text-[#7A6A5C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6A5C] hover:text-[#2A211A]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Zone Selector */}
          <div className="md:col-span-3">
            <label className="text-xs font-bold uppercase text-[#7A6A5C] tracking-wide block mb-1.5">
              Secteur / Ville
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3049]"
            >
              <option value="all">📍 Toutes les zones</option>
              <option value="Plateau">Dakar Plateau / Centre</option>
              <option value="Médina">Médina / Gueule Tapée</option>
              <option value="Almadies">Almadies / Ngor / Ouakam</option>
              <option value="Grand Yoff">Grand Yoff / VDN</option>
              <option value="Pikine">Pikine / Guédiawaye</option>
              <option value="Rufisque">Rufisque / Diamniadio</option>
              <option value="Mbour">Mbour / Saly / Somone</option>
              <option value="Thiès">Thiès & Régions</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="md:col-span-3">
            <label className="text-xs font-bold uppercase text-[#7A6A5C] tracking-wide block mb-1.5">
              Type de Véhicule
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3049]"
            >
              <option value="all">Tous les véhicules</option>
              <option value="moto">🛵 Moto Express (&lt; 10 kg)</option>
              <option value="voiture">🚗 Voiture Break (&lt; 80 kg)</option>
              <option value="camionnette">🚚 Camionnette Fret (&gt; 80 kg)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DDCDB6]/60">
          <span className="text-xs font-bold text-[#7A6A5C] mr-2">Filtres rapides :</span>
          <button
            type="button"
            onClick={() => {
              setSelectedVehicle('all');
              setSelectedZone('all');
              setSearchQuery('');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedVehicle === 'all' && selectedZone === 'all' && !searchQuery
                ? 'bg-[#1C3049] text-white'
                : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            Tous ({COURIER_LISTINGS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedVehicle('moto')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedVehicle === 'moto'
                ? 'bg-[#1C3049] text-white'
                : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            🛵 Motos Express
          </button>
          <button
            type="button"
            onClick={() => setSelectedVehicle('voiture')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedVehicle === 'voiture'
                ? 'bg-[#1C3049] text-white'
                : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            🚗 Voitures Break
          </button>
          <button
            type="button"
            onClick={() => setSelectedVehicle('camionnette')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedVehicle === 'camionnette'
                ? 'bg-[#1C3049] text-white'
                : 'bg-[#F2E9DC] text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            🚚 Camionnettes & Fret
          </button>
        </div>
      </div>

      {/* Couriers Cards Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#2A211A]">
            Livreurs disponibles ({filteredCouriers.length})
          </h2>
          <span className="text-xs text-[#7A6A5C]">
            Contact direct par WhatsApp ou Appel vocal
          </span>
        </div>

        {filteredCouriers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DDCDB6] p-12 text-center flex flex-col items-center gap-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-[#2A211A]">Aucun livreur trouvé pour ces critères</h3>
            <p className="text-xs sm:text-sm text-[#7A6A5C] max-w-md">
              Essayez de modifier votre recherche ou de réinitialiser les filtres pour voir les livreurs disponibles.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSelectedVehicle('all');
                setSelectedZone('all');
                setSearchQuery('');
              }}
            >
              <span>Réinitialiser les filtres</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCouriers.map((courier) => (
              <div
                key={courier.id}
                className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:border-[#1C3049]/40 transition-all group"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Profile Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={courier.avatar}
                          alt={courier.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#DDCDB6] group-hover:border-[#1C3049] transition-colors"
                        />
                        {courier.isOnline && (
                          <span
                            className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                            title="En ligne"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-[#2A211A] group-hover:text-[#1C3049] transition-colors">
                            {courier.name}
                          </h3>
                          {courier.isVerified && (
                            <IconShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#1C3049] block">
                          {courier.vehicleLabel}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#7A6A5C] mt-0.5">
                          <span className="text-amber-500 font-bold">★ {courier.rating}</span>
                          <span>({courier.reviewsCount} livraisons)</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-[#1C3049]/10 text-[#1C3049] text-[10px] font-bold uppercase tracking-wider shrink-0">
                      {courier.planBadge}
                    </span>
                  </div>

                  {/* Zone & Vehicle Info */}
                  <div className="bg-[#FAF8F5] p-3 rounded-[10px] border border-[#DDCDB6]/70 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#573721] font-semibold">
                      <IconMapPin className="w-3.5 h-3.5 text-[#7A5133] shrink-0" />
                      <span>Secteur : {courier.zone} ({courier.city})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#7A6A5C]">
                      <IconPackage className="w-3.5 h-3.5 text-[#1C3049] shrink-0" />
                      <span>Véhicule : {courier.vehicleModel}</span>
                    </div>
                  </div>

                  {/* Courier Bio */}
                  <p className="text-xs text-[#7A6A5C] line-clamp-3 leading-relaxed">
                    {courier.description}
                  </p>

                  {/* Pricing mention */}
                  <div className="text-[11px] text-[#1C3049] font-semibold bg-[#1C3049]/5 px-3 py-1.5 rounded-[8px] flex items-center gap-1.5">
                    <span>💬</span>
                    <span>{courier.pricingNote}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#DDCDB6]/60">
                  <a
                    href={`https://wa.me/${courier.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${courier.name}, j'ai vu votre annonce de livreur sur NovaSen. J'ai un colis à faire livrer dans le secteur de ${courier.zone}. Quel est votre prix ?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${courier.phone.replace(/\s+/g, '')}`}
                    className="py-2.5 px-3 rounded-[10px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <IconPhone className="w-3.5 h-3.5 text-[#C9A882]" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Driver CTA Box */}
      <div className="bg-[#E8DBC8] rounded-[16px] border border-[#DDCDB6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold text-xl shrink-0">
            🛵
          </div>
          <div>
            <h3 className="font-bold text-lg font-heading text-[#573721]">
              Vous êtes livreur ou coursier avec votre propre véhicule ?
            </h3>
            <p className="text-xs sm:text-sm text-[#2A211A]/85 mt-1 leading-relaxed max-w-2xl">
              Publiez votre annonce dans votre quartier de Dakar et recevez directement les demandes des marchands et clients. Choisissez votre pass 1 500 F/j, 35 000 F/mois ou 400 000 F/an sans commission !
            </p>
          </div>
        </div>

        <Link href="/livreur" className="shrink-0 w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full shadow-md">
            <span>Publier mon annonce livreur</span>
            <IconArrowRight className="w-4 h-4 text-[#E8DBC8]" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function TransportPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center font-bold text-[#1C3049]">Chargement de l'annuaire des livreurs...</div>}>
      <TransportContent />
    </Suspense>
  );
}
