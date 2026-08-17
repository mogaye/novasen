'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ZoneId, ParcelClass, PaymentMethod, DriverAssignment } from '@/lib/types';
import { ZONES_BY_ID } from '@/lib/zones';
import { calculateFares, calculateTripMetrics, isCurrentlyRushHour } from '@/lib/fares';
import { formatCFA, formatDistance, formatDuration } from '@/lib/format';
import { RouteMap } from '@/components/RouteMap';
import { CourierFound } from '@/components/CourierFound';
import { LocationSearchInput } from '@/components/ui/LocationSearchInput';
import { Button } from '@/components/ui/Button';
import {
  IconPackage,
  IconClock,
  IconShieldCheck,
  IconPhone,
  IconArrowRight,
} from '@/components/ui/Icons';

const VERIFIED_COURIERS: DriverAssignment[] = [
  {
    name: 'Ousmane Ba',
    rating: 4.95,
    tripsCount: 2310,
    vehicleModel: 'Honda Dio 110cc (Moto Express)',
    licensePlate: 'DK-7104-BB',
    phone: '+221 77 645 28 19',
    whatsapp: '+221 77 645 28 19',
    etaMinutes: 5,
    baseZone: 'Médina / Plateau',
    isVerified: true,
  },
  {
    name: 'Cheikhna Ndiaye',
    rating: 4.9,
    tripsCount: 1420,
    vehicleModel: 'Peugeot 301 (Voiture Break)',
    licensePlate: 'DK-4829-AZ',
    phone: '+221 78 412 90 33',
    whatsapp: '+221 78 412 90 33',
    etaMinutes: 12,
    baseZone: 'Grand Yoff / VDN',
    isVerified: true,
  },
  {
    name: 'Moussa Sow',
    rating: 4.88,
    tripsCount: 980,
    vehicleModel: 'Toyota HiAce (Fourgonnette Fret)',
    licensePlate: 'DK-9031-CT',
    phone: '+221 76 304 88 12',
    whatsapp: '+221 76 304 88 12',
    etaMinutes: 20,
    baseZone: 'Pikine / Guédiawaye',
    isVerified: true,
  },
];

function TransportContent() {
  const searchParams = useSearchParams();
  const initialFrom = (searchParams.get('from') as ZoneId) || 'plateau';
  const initialTo = (searchParams.get('to') as ZoneId) || 'almadies';

  const [originId, setOriginId] = useState<ZoneId>(initialFrom);
  const [originName, setOriginName] = useState(ZONES_BY_ID[initialFrom]?.name || 'Plateau');
  const [destinationId, setDestinationId] = useState<ZoneId>(initialTo);
  const [destinationName, setDestinationName] = useState(ZONES_BY_ID[initialTo]?.name || 'Almadies');

  // Parcel vehicle selection
  const [parcelClass, setParcelClass] = useState<ParcelClass>('moto');

  // Rush hour toggle
  const [forceRushHour, setForceRushHour] = useState<boolean>(isCurrentlyRushHour());

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Search & Assignment state
  const [isSearching, setIsSearching] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState<DriverAssignment | null>(null);

  // Recalculate metrics
  const fareResult = calculateFares(originId, destinationId, forceRushHour);
  const tripMetrics = calculateTripMetrics(originId, destinationId, forceRushHour);
  const estimatedFare = fareResult.parcelFares[parcelClass];

  const handleOrder = () => {
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const fakeDriver: DriverAssignment = {
        name:
          parcelClass === 'moto'
            ? 'Ousmane Ba (Coursier Moto)'
            : parcelClass === 'voiture'
            ? 'Cheikhna Ndiaye (Voiture Break)'
            : 'Moussa Sow (Camionnette Fret)',
        rating: 4.95,
        tripsCount: 1840,
        vehicleModel:
          parcelClass === 'moto'
            ? 'Honda Dio 110cc Rouge'
            : parcelClass === 'voiture'
            ? 'Peugeot 301 Bleue'
            : 'Toyota HiAce Fourgonnette',
        licensePlate: 'DK-4829-AZ',
        phone: '+221 77 645 28 19',
        whatsapp: '+221 77 645 28 19',
        etaMinutes: Math.floor(Math.random() * 4) + 3,
        baseZone: originName,
        isVerified: true,
      };
      setAssignedDriver(fakeDriver);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 animate-page-reveal">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DDCDB6] animate-stagger-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
            Logistique Express • Colis & Marchandises
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#1C3049] tracking-tight mt-1">
            Service Livraison Colis & Coursiers
          </h1>
          <p className="text-sm text-[#7A6A5C] mt-1 max-w-2xl">
            Expédiez vos plis, colis et marchandises d'un point A à un point B à Dakar et partout au Sénégal. Mise en relation directe avec les livreurs indépendants certifiés.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tarifs#bascule">
            <span className="px-4 py-2 rounded-[8px] bg-[#FAF8F5] border border-[#DDCDB6] hover:bg-[#E8DBC8] text-[#573721] text-xs font-bold transition-all inline-flex items-center gap-1.5">
              <span>💳 Forfaits Livreurs (0% commission)</span>
            </span>
          </Link>
          <Link href="/livreur">
            <Button variant="primary" size="md">
              <span>Devenir Livreur</span>
              <IconArrowRight className="w-4 h-4 text-[#E8DBC8]" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Principle Banner */}
      <div className="bg-[#1C3049] text-white p-5 sm:p-6 rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#C9A882] text-[#1C3049] flex items-center justify-center font-bold shrink-0 text-xl">
            📦
          </div>
          <div>
            <h3 className="font-bold text-base font-heading text-white">
              Liberté tarifaire & Relation directe
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DBC8]/90 mt-0.5 leading-relaxed">
              Le tarif calculé ci-dessous est un <strong>repère estimatif basé sur la distance</strong>. Vous convenez librement du montant final avec votre coursier. NovaSen ne prélève aucune commission (0%).
            </p>
          </div>
        </div>
      </div>

      {/* Main Delivery Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Departure & Destination */}
          <div className="bg-white rounded-2xl border border-[#DDCDB6] p-6 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DDCDB6]/70 pb-3">
              <div>
                <h3 className="font-bold text-lg font-heading text-[#2A211A]">
                  Trajet & Itinéraire de livraison
                </h3>
                <p className="text-xs text-[#7A6A5C]">
                  Indiquez le lieu de collecte et l'adresse de réception
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const tempId = originId;
                  const tempName = originName;
                  setOriginId(destinationId);
                  setOriginName(destinationName);
                  setDestinationId(tempId);
                  setDestinationName(tempName);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2E9DC] hover:bg-[#E8DBC8] text-xs font-bold text-[#1C3049] transition-colors cursor-pointer"
                title="Inverser départ et destination"
              >
                <span>⇄ Inverser</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <LocationSearchInput
                label="Lieu de collecte (Expéditeur)"
                value={originId}
                customText={originName}
                onChange={(id, name) => {
                  setOriginId(id);
                  setOriginName(name);
                }}
                placeholder="Tapez un quartier de collecte..."
                accentColor="transport"
              />

              <LocationSearchInput
                label="Lieu de livraison (Destinataire)"
                value={destinationId}
                customText={destinationName}
                onChange={(id, name) => {
                  setDestinationId(id);
                  setDestinationName(name);
                }}
                placeholder="Tapez un quartier de livraison..."
                accentColor="transport"
              />
            </div>

            {/* Trip summary indicators */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="bg-[#F2E9DC]/70 p-3 rounded-xl border border-[#DDCDB6]/60 flex flex-col justify-center">
                <span className="text-[11px] uppercase font-bold text-[#7A6A5C] tracking-wide block mb-0.5">
                  Distance
                </span>
                <span className="text-base sm:text-lg font-bold tabular-nums text-[#1C3049]">
                  {formatDistance(tripMetrics.distanceKm)}
                </span>
              </div>
              <div className="bg-[#F2E9DC]/70 p-3 rounded-xl border border-[#DDCDB6]/60 flex flex-col justify-center">
                <span className="text-[11px] uppercase font-bold text-[#7A6A5C] tracking-wide block mb-0.5">
                  Durée estimée
                </span>
                <span className="text-base sm:text-lg font-bold tabular-nums text-[#1C3049]">
                  {formatDuration(tripMetrics.durationMinutes)}
                </span>
              </div>
              <div className="bg-[#F2E9DC]/70 p-3 rounded-xl border border-[#DDCDB6]/60 flex flex-col justify-center">
                <span className="text-[11px] uppercase font-bold text-[#7A6A5C] tracking-wide block mb-0.5">
                  Zone
                </span>
                <span className="text-xs font-bold text-[#2A211A]">
                  {tripMetrics.isInterurban ? 'Interurbain' : 'Urbain Dakar'}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-base font-heading text-[#573721]">
              Choisissez le gabarit de véhicule adapté à votre colis
            </h3>

            <div className="flex flex-col gap-3">
              {/* Moto Express */}
              <div
                onClick={() => setParcelClass('moto')}
                className={`p-4 rounded-[8px] border flex items-center justify-between cursor-pointer transition-all ${
                  parcelClass === 'moto'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold text-lg">
                    🛵
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#2A211A]">Moto Express</h4>
                      <span className="text-[0.7rem] bg-white px-2 py-0.5 rounded border border-[#DDCDB6] text-[#7A6A5C]">
                        Petits colis (&lt; 10 kg)
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6A5C]">Documents, vêtements, smartphones, repas</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7A6A5C] block">Repère indicatif</span>
                  <span className="text-lg font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.moto)}
                  </span>
                </div>
              </div>

              {/* Voiture Break */}
              <div
                onClick={() => setParcelClass('voiture')}
                className={`p-4 rounded-[8px] border flex items-center justify-between cursor-pointer transition-all ${
                  parcelClass === 'voiture'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#573721] text-white flex items-center justify-center font-bold text-lg">
                    🚗
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#2A211A]">Voiture / Break</h4>
                      <span className="text-[0.7rem] bg-[#E8DBC8] px-2 py-0.5 rounded text-[#573721] font-semibold">
                        Cartons & Appareils (&lt; 80 kg)
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6A5C]">TV, plusieurs cartons volumineux, électroménager</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7A6A5C] block">Repère indicatif</span>
                  <span className="text-lg font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.voiture)}
                  </span>
                </div>
              </div>

              {/* Camionnette Fret */}
              <div
                onClick={() => setParcelClass('camionnette')}
                className={`p-4 rounded-[8px] border flex items-center justify-between cursor-pointer transition-all ${
                  parcelClass === 'camionnette'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#13223A] text-white flex items-center justify-center font-bold text-lg">
                    🚚
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#2A211A]">Camionnette / Pickup</h4>
                      <span className="text-[0.7rem] bg-[#1C3049] text-white px-2 py-0.5 rounded font-semibold">
                        Fret lourd & Meubles (&gt; 80 kg)
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6A5C]">Déménagements, frigos, matériaux, marchandises</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7A6A5C] block">Repère indicatif</span>
                  <span className="text-lg font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.camionnette)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order / Dispatch Button */}
            <div className="pt-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleOrder}
                disabled={isSearching}
                className="bg-[#1C3049] hover:bg-[#13223A] min-h-[50px] text-sm"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>Recherche d'un livreur disponible à proximité...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🛵 Demander un coursier pour ce trajet</span>
                    <IconArrowRight className="w-4 h-4 text-[#C9A882]" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map & Courier Contact Directory */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Map Preview */}
          <div className="bg-white rounded-2xl border border-[#DDCDB6] p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
                Carte du trajet de livraison
              </span>
              <span className="text-xs text-[#7A6A5C]">
                {originName} ➔ {destinationName}
              </span>
            </div>

            <div className="h-72 w-full rounded-xl overflow-hidden border border-[#DDCDB6]">
              <RouteMap
                originId={originId}
                destinationId={destinationId}
                mode="colis"
                vehicleType={parcelClass}
                className="h-72 w-full"
              />
            </div>
          </div>

          {/* Assigned Driver Modal/Card if triggered */}
          {assignedDriver && (
            <CourierFound
              driver={assignedDriver}
              fare={estimatedFare}
              type="colis"
              paymentMethod={paymentMethod}
              onClose={() => setAssignedDriver(null)}
            />
          )}

          {/* Annuaire des livreurs certifiés disponibles en direct */}
          <div className="bg-white rounded-2xl border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DDCDB6]/70 pb-3">
              <div>
                <h3 className="font-bold text-base font-heading text-[#573721]">
                  Livreurs indépendants certifiés à Dakar
                </h3>
                <p className="text-xs text-[#7A6A5C]">
                  Contactez directement un livreur pour convenir de votre livraison
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                🟢 En ligne
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {VERIFIED_COURIERS.map((courier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[10px] bg-[#FAF8F5] border border-[#DDCDB6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {courier.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#2A211A]">{courier.name}</span>
                        <IconShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-xs text-[#7A6A5C]">{courier.vehicleModel}</span>
                      <span className="text-[11px] text-[#573721] font-semibold">📍 Secteur : {courier.baseZone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${courier.whatsapp?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${courier.name}, j'ai un colis à livrer de ${originName} vers ${destinationName}. Quel est votre tarif ?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-[8px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${courier.phone.replace(/\s+/g, '')}`}
                      className="px-3 py-2 rounded-[8px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <IconPhone className="w-3 h-3 text-[#C9A882]" />
                      <span>Appeler</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransportPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center font-bold text-[#1C3049]">Chargement du service transport & livraison...</div>}>
      <TransportContent />
    </Suspense>
  );
}
