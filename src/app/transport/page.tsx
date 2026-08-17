'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZoneId, PassengerClass, ParcelClass, PaymentMethod, DriverAssignment } from '@/lib/types';
import { ZONES, ZONES_BY_ID } from '@/lib/zones';
import { calculateFares, calculateTripMetrics, isCurrentlyRushHour } from '@/lib/fares';
import { formatCFA, formatDistance, formatDuration } from '@/lib/format';
import { RouteMap } from '@/components/RouteMap';
import { CourierFound } from '@/components/CourierFound';
import { LocationSearchInput } from '@/components/ui/LocationSearchInput';
import { Button } from '@/components/ui/Button';
import {
  IconCar,
  IconPackage,
  IconMapPin,
  IconClock,
  IconStar,
  IconShieldCheck,
  IconCheck,
} from '@/components/ui/Icons';

function TransportContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'colis' ? 'colis' : 'passagers';
  const initialFrom = (searchParams.get('from') as ZoneId) || 'plateau';
  const initialTo = (searchParams.get('to') as ZoneId) || 'almadies';

  const [activeTab, setActiveTab] = useState<'passagers' | 'colis'>(initialTab);
  const [originId, setOriginId] = useState<ZoneId>(initialFrom);
  const [originName, setOriginName] = useState(ZONES_BY_ID[initialFrom]?.name || 'Plateau');
  const [destinationId, setDestinationId] = useState<ZoneId>(initialTo);
  const [destinationName, setDestinationName] = useState(ZONES_BY_ID[initialTo]?.name || 'Almadies');

  // Passenger selection
  const [passengerClass, setPassengerClass] = useState<PassengerClass>('eco');

  // Parcel selection
  const [parcelClass, setParcelClass] = useState<ParcelClass>('moto');

  // Rush hour
  const [forceRushHour, setForceRushHour] = useState<boolean>(isCurrentlyRushHour());

  // Payment method (Espèces, Wave, Orange Money in terrain order)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Search & Assignment state
  const [isSearching, setIsSearching] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState<DriverAssignment | null>(null);

  // Recalculate fares
  const fareResult = calculateFares(originId, destinationId, forceRushHour);
  const tripMetrics = calculateTripMetrics(originId, destinationId, forceRushHour);

  const getCurrentFare = () => {
    if (activeTab === 'passagers') {
      return fareResult.passengerFares[passengerClass];
    } else {
      return fareResult.parcelFares[parcelClass];
    }
  };

  const handleOrder = () => {
    setIsSearching(true);

    // Simulate finding a nearby dakarois driver in 1.8 seconds
    setTimeout(() => {
      setIsSearching(false);
      const fakeDriver: DriverAssignment = {
        name: activeTab === 'passagers' ? 'Mamadou Lamine Diop' : 'Cheikhna Ndiaye',
        rating: 4.9,
        tripsCount: 1420,
        vehicleModel:
          activeTab === 'passagers'
            ? passengerClass === 'eco'
              ? 'Toyota Corolla Grise'
              : 'Hyundai Tucson Noir'
            : parcelClass === 'moto'
            ? 'Honda Dio 110cc Rouge'
            : parcelClass === 'voiture'
            ? 'Peugeot 301 Bleue'
            : 'Toyota HiAce Fourgonnette',
        licensePlate: 'DK-4829-AZ',
        phone: '+221 77 512 84 90',
        etaMinutes: Math.floor(Math.random() * 4) + 3,
      };
      setAssignedDriver(fakeDriver);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 animate-page-reveal">
      {/* Page Title & Service Tab switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DDCDB6] animate-stagger-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
            Logistique & Déplacements • Tout le Sénégal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#1C3049] tracking-tight mt-1">
            Transport Passagers & Livraison Colis
          </h1>
          <p className="text-sm text-[#7A6A5C] mt-1">
            Calcul instantané des tarifs, transport urbain & interurbain à travers les 14 régions du Sénégal.
          </p>
        </div>

        {/* Tab switcher */}
        <div
          role="tablist"
          className="flex bg-[#E8DBC8] p-1.5 rounded-[8px] border border-[#DDCDB6] self-start md:self-auto shadow-xs"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'passagers'}
            onClick={() => setActiveTab('passagers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'passagers'
                ? 'bg-[#1C3049] text-white shadow-[0_0_12px_rgba(28,48,73,0.4)]'
                : 'text-[#1C3049] hover:text-[#13223A]'
            }`}
          >
            <IconCar className="w-4 h-4" />
            <span>Passagers (VTC)</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'colis'}
            onClick={() => setActiveTab('colis')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'colis'
                ? 'bg-[#1C3049] text-white shadow-[0_0_12px_rgba(28,48,73,0.4)]'
                : 'text-[#1C3049] hover:text-[#13223A]'
            }`}
          >
            <IconPackage className="w-4 h-4" />
            <span>Livraison Colis</span>
          </button>
        </div>
      </div>

      {/* Main Booking & Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Searchable Departure & Destination inputs */}
          <div className="bg-white rounded-2xl border border-[#DDCDB6] p-6 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DDCDB6]/70 pb-3">
              <div>
                <h3 className="font-bold text-lg font-heading text-[#2A211A]">
                  Itinéraire et recherche de lieux
                </h3>
                <p className="text-xs text-[#7A6A5C]">
                  Sélectionnez vos points de départ et d’arrivée
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2E9DC] hover:bg-[#E8DBC8] text-xs font-bold text-[#1C3049] transition-colors shadow-2xs cursor-pointer"
                title="Inverser départ et destination"
              >
                <span>⇄ Inverser</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <LocationSearchInput
                label="Point de départ"
                value={originId}
                customText={originName}
                onChange={(id, name) => {
                  setOriginId(id);
                  setOriginName(name);
                }}
                placeholder="Tapez un quartier de départ..."
                accentColor="transport"
              />

              <LocationSearchInput
                label="Destination finale"
                value={destinationId}
                customText={destinationName}
                onChange={(id, name) => {
                  setDestinationId(id);
                  setDestinationName(name);
                }}
                placeholder="Tapez un quartier d'arrivée..."
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
                  Vitesse moy.
                </span>
                <span className="text-base sm:text-lg font-bold text-[#2A211A]">22 km/h</span>
              </div>
            </div>

            {/* Rush hour toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#E8DBC8]/50 rounded-xl border border-[#DDCDB6] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1C3049]/10 text-[#1C3049] flex items-center justify-center shrink-0">
                  <IconClock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#2A211A] block">Trafic & Heures de pointe (7h–9h / 17h–20h)</span>
                  <span className="text-[#7A6A5C] text-[11px]">
                    {forceRushHour
                      ? '+25% passagers et durée x1,5 appliquée'
                      : 'Conditions de circulation fluide'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForceRushHour(!forceRushHour)}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-2xs cursor-pointer ${
                  forceRushHour
                    ? 'bg-[#1C3049] text-white shadow-sm'
                    : 'bg-white text-[#2A211A] border border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                {forceRushHour ? '✓ Actif' : 'Désactivé'}
              </button>
            </div>
          </div>

          {/* Service Classes (Passagers OR Colis) */}
          <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-base font-heading text-[#573721]">
              {activeTab === 'passagers' ? 'Choisissez votre catégorie VTC' : 'Choisissez le type de transport colis'}
            </h3>

            {activeTab === 'passagers' ? (
              <div className="flex flex-col gap-3">
                {/* Éco */}
                <div
                  onClick={() => setPassengerClass('eco')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    passengerClass === 'eco'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold">
                      <IconCar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Éco</h4>
                        <span className="text-[0.7rem] bg-white px-2 py-0.5 rounded border border-[#DDCDB6] text-[#7A6A5C]">
                          Standard 4 places
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">300 F base + 170 F/km + 15 F/min (min 570 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.passengerFares.eco)}
                  </span>
                </div>

                {/* Confort */}
                <div
                  onClick={() => setPassengerClass('confort')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    passengerClass === 'confort'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#573721] text-white flex items-center justify-center font-bold">
                      <IconCar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Confort</h4>
                        <span className="text-[0.7rem] bg-[#E8DBC8] px-2 py-0.5 rounded text-[#573721] font-semibold">
                          Climatisation & Berline
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">400 F base + 215 F/km + 20 F/min (min 680 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.passengerFares.confort)}
                  </span>
                </div>

                {/* Confort + */}
                <div
                  onClick={() => setPassengerClass('confort_plus')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    passengerClass === 'confort_plus'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#13223A] text-[#C9A882] flex items-center justify-center font-bold">
                      <IconStar className="w-5 h-5 text-[#C9A882]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Confort +</h4>
                        <span className="text-[0.7rem] bg-[#1C3049] text-white px-2 py-0.5 rounded font-semibold">
                          SUV & Haut standing
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">500 F base + 290 F/km + 28 F/min (min 800 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.passengerFares.confort_plus)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Moto */}
                <div
                  onClick={() => setParcelClass('moto')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    parcelClass === 'moto'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold">
                      🏍️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Moto Express (≤ 5 kg)</h4>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">Documents, téléphone, pièce détachée • 500 F + 130 F/km (min 700 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.moto)}
                  </span>
                </div>

                {/* Voiture */}
                <div
                  onClick={() => setParcelClass('voiture')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    parcelClass === 'voiture'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold">
                      🚗
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Voiture (≤ 30 kg)</h4>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">Cartons, micro-ondes, courses marché • 800 F + 190 F/km (min 1 200 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.voiture)}
                  </span>
                </div>

                {/* Camionnette */}
                <div
                  onClick={() => setParcelClass('camionnette')}
                  className={`p-4 rounded-[6px] border flex items-center justify-between cursor-pointer transition-all ${
                    parcelClass === 'camionnette'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#573721] text-white flex items-center justify-center font-bold">
                      🚚
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A211A]">Camionnette (≤ 300 kg)</h4>
                      </div>
                      <p className="text-xs text-[#7A6A5C]">Meubles, réfrigérateur, déménagement • 2 500 F + 320 F/km (min 4 000 F)</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fareResult.parcelFares.camionnette)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-base font-heading text-[#573721]">
              Mode de règlement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-[6px] border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/60 font-bold ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] bg-white'
                }`}
              >
                <span className="text-[#2A211A] text-sm">💵 Espèces</span>
                <span className="text-[#7A6A5C] text-[0.7rem]">Au chauffeur / livreur</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wave')}
                className={`p-3.5 rounded-[6px] border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'wave'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/60 font-bold ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] bg-white'
                }`}
              >
                <span className="text-[#1C3049] text-sm">🌊 Wave</span>
                <span className="text-[#7A6A5C] text-[0.7rem]">Paiement instantané</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('orange_money')}
                className={`p-3.5 rounded-[6px] border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'orange_money'
                    ? 'border-[#7A5133] bg-[#E8DBC8]/60 font-bold ring-1 ring-[#7A5133]'
                    : 'border-[#DDCDB6] bg-white'
                }`}
              >
                <span className="text-[#7A5133] text-sm">🟠 Orange Money</span>
                <span className="text-[#7A6A5C] text-[0.7rem]">Code marchand / Push</span>
              </button>
            </div>

            {/* Total Fare & Order Button */}
            <div className="pt-4 border-t border-[#DDCDB6] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#7A6A5C]">Tarif total garanti</span>
                <span className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {formatCFA(getCurrentFare())}
                </span>
              </div>

              <Button
                variant="dark"
                size="lg"
                fullWidth
                onClick={handleOrder}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recherche d’un coursier à proximité...</span>
                  </span>
                ) : (
                  <span>
                    {activeTab === 'passagers'
                      ? `Commander le trajet (${formatCFA(getCurrentFare())})`
                      : `Commander la livraison (${formatCFA(getCurrentFare())})`}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Map Column */}
        <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-4 shadow-sm flex flex-col gap-3">
            <RouteMap
              originId={originId}
              destinationId={destinationId}
              mode={activeTab}
              vehicleType={parcelClass}
              className="h-80 sm:h-[460px] w-full"
            />
            <div className="flex items-center justify-between px-2 text-xs text-[#7A6A5C]">
              <span>Trajet calculé : {originName} → {destinationName}</span>
              <span className="font-semibold text-[#1C3049]">Réseau NovaSen actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {assignedDriver && (
        <CourierFound
          driver={assignedDriver}
          fare={getCurrentFare()}
          type={activeTab}
          paymentMethod={paymentMethod}
          onClose={() => setAssignedDriver(null)}
        />
      )}
    </div>
  );
}

export default function TransportPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center font-bold text-[#1C3049]">Chargement du module transport...</div>}>
      <TransportContent />
    </Suspense>
  );
}
