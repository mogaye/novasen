'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { INITIAL_LISTINGS } from '@/lib/listings';
import { ZONES, ZONES_BY_ID } from '@/lib/zones';
import { ZoneId, ParcelClass, PaymentMethod, DriverAssignment } from '@/lib/types';
import { calculateFares, calculateTripMetrics } from '@/lib/fares';
import { formatCFA, formatDistance, formatDuration } from '@/lib/format';
import { RouteMap } from '@/components/RouteMap';
import { CourierFound } from '@/components/CourierFound';
import { LocationSearchInput } from '@/components/ui/LocationSearchInput';
import { Button } from '@/components/ui/Button';
import {
  IconPackage,
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconCheck,
  IconArrowLeft,
} from '@/components/ui/Icons';
import { LogoWave, LogoOrangeMoney, LogoCard } from '@/components/PaymentLogos';

function LivraisonContent() {
  const searchParams = useSearchParams();
  const annonceId = searchParams.get('annonceId') || 'tel-1';
  const { listings } = useApp();

  const [activeListing, setActiveListing] = useState<any>(null);

  useEffect(() => {
    const found = listings.find((l) => String(l.id) === String(annonceId)) ||
      INITIAL_LISTINGS.find((l) => String(l.id) === String(annonceId));
    if (found) {
      setActiveListing(found);
    } else {
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('novasen_custom_listings');
          if (cached) {
            const parsed = JSON.parse(cached);
            const fromCache = parsed.find((l: any) => String(l.id) === String(annonceId));
            if (fromCache) {
              setActiveListing(fromCache);
              return;
            }
          }
        } catch (e) {}
      }
      setActiveListing(INITIAL_LISTINGS[0]);
    }
  }, [annonceId, listings]);

  const listing = activeListing || listings.find((l) => String(l.id) === String(annonceId)) || INITIAL_LISTINGS[0];

  const originId: ZoneId = (listing.zoneId as ZoneId) || 'plateau';
  const [destinationId, setDestinationId] = useState<ZoneId>('pointe');
  const [destinationName, setDestinationName] = useState(ZONES_BY_ID['pointe']?.name || 'Point E');

  // Default parcel vehicle based on category
  const defaultParcelClass: ParcelClass =
    listing.category === 'immobilier' || listing.category === 'vehicules'
      ? 'voiture'
      : listing.category === 'maison'
      ? 'camionnette'
      : 'moto';

  const [parcelClass, setParcelClass] = useState<ParcelClass>(defaultParcelClass);
  const [enableCod, setEnableCod] = useState<boolean>(true); // Cash on delivery
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('77 450 12 34');

  const [isOrdering, setIsOrdering] = useState(false);
  const [assignedDriver, setAssignedDriver] = useState<DriverAssignment | null>(null);

  const fares = calculateFares(originId, destinationId);
  const tripMetrics = calculateTripMetrics(originId, destinationId);
  const deliveryFare = fares.parcelFares[parcelClass];
  const totalAmount = enableCod ? (listing.price || 0) + deliveryFare : deliveryFare;

  const handleOrderDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    setTimeout(() => {
      setIsOrdering(false);
      const fakeCourier: DriverAssignment = {
        name: 'Ousmane Ba (Coursier NovaSen)',
        rating: 4.95,
        tripsCount: 2310,
        vehicleModel:
          parcelClass === 'moto'
            ? 'Honda Dio 110cc Noire'
            : parcelClass === 'voiture'
            ? 'Peugeot 301 Grise'
            : 'Toyota HiAce Fourgonnette',
        licensePlate: 'DK-7104-BB',
        phone: '+221 78 120 44 88',
        etaMinutes: 4,
      };
      setAssignedDriver(fakeCourier);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Breadcrumbs */}
      <div>
        <Link
          href={`/annonce/${listing.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A6A5C] hover:text-[#573721]"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Retour à l’annonce : {listing.title}</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 pb-4 border-b border-[#DDCDB6]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#1C3049] text-white text-xs font-bold uppercase tracking-wider w-fit">
          <IconPackage className="w-4 h-4 text-[#C9A882]" />
          <span>Livraison directe & Encaissement sécurisé</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#573721] tracking-tight">
          Faire livrer : {listing.title}
        </h1>
        <p className="text-sm text-[#7A6A5C]">
          Un coursier NovaSen se rend chez le vendeur à <strong>{listing.neighborhood}</strong> et vous livre directement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Delivery Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form onSubmit={handleOrderDelivery} className="flex flex-col gap-6">
            {/* 1. Article & Seller Origin Card */}
            <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
                1. Article & Prise en charge
              </span>
              <div className="flex items-start justify-between gap-4 p-4 bg-[#F2E9DC] rounded-[6px] border border-[#DDCDB6]">
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-base text-[#2A211A]">{listing.title}</h4>
                  <p className="text-xs text-[#7A6A5C]">
                    Vendeur : <strong>{listing.sellerName}</strong> ({listing.sellerSeniority})
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[#573721] font-semibold mt-1">
                    <IconMapPin className="w-3.5 h-3.5 text-[#7A5133]" />
                    <span>Lieu de collecte pré-rempli : {listing.neighborhood}</span>
                  </div>
                </div>
                {/* RULE OF COLOR: Dark Blue */}
                <div className="text-right">
                  <span className="text-xs text-[#7A6A5C] uppercase block">Prix article</span>
                  <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(listing.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Delivery Destination with Searchable Input */}
            <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
                2. Adresse de livraison à Dakar
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocationSearchInput
                  label="Quartier de livraison"
                  value={destinationId}
                  customText={destinationName}
                  onChange={(id, name) => {
                    setDestinationId(id);
                    setDestinationName(name);
                  }}
                  placeholder="Tapez votre quartier..."
                  accentColor="transport"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
                    Précision d’adresse (Villa, Rue, Repère)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Villa 124 près de la pharmacie"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full min-h-[54px] px-3 bg-[#E8DBC8]/50 text-sm rounded-[6px] border border-[#DDCDB6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
                  Numéro de téléphone pour la réception (+221)
                </label>
                <input
                  type="text"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full min-h-[50px] px-3 bg-[#E8DBC8]/50 text-sm font-semibold rounded-[4px] border border-[#DDCDB6] focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Parcel Format */}
            <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A5133]">
                3. Formule de transport adaptée
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setParcelClass('moto')}
                  className={`p-3.5 rounded-[6px] border text-left flex flex-col justify-between gap-2 transition-all ${
                    parcelClass === 'moto'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/60 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2A211A]">🏍️ Moto</span>
                    <span className="text-[0.7rem] bg-white px-1.5 py-0.5 rounded text-[#7A6A5C]">≤ 5 kg</span>
                  </div>
                  <span className="text-base font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fares.parcelFares.moto)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setParcelClass('voiture')}
                  className={`p-3.5 rounded-[6px] border text-left flex flex-col justify-between gap-2 transition-all ${
                    parcelClass === 'voiture'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/60 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2A211A]">🚗 Voiture</span>
                    <span className="text-[0.7rem] bg-white px-1.5 py-0.5 rounded text-[#7A6A5C]">≤ 30 kg</span>
                  </div>
                  <span className="text-base font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fares.parcelFares.voiture)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setParcelClass('camionnette')}
                  className={`p-3.5 rounded-[6px] border text-left flex flex-col justify-between gap-2 transition-all ${
                    parcelClass === 'camionnette'
                      ? 'border-[#1C3049] bg-[#E8DBC8]/60 ring-1 ring-[#1C3049]'
                      : 'border-[#DDCDB6] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2A211A]">🚚 Camionnette</span>
                    <span className="text-[0.7rem] bg-white px-1.5 py-0.5 rounded text-[#7A6A5C]">≤ 300 kg</span>
                  </div>
                  <span className="text-base font-bold font-heading tabular-nums text-[#1C3049]">
                    {formatCFA(fares.parcelFares.camionnette)}
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Payment on delivery checkbox (COD) */}
            <div className="bg-[#E8DBC8] rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cod-check"
                  checked={enableCod}
                  onChange={(e) => setEnableCod(e.target.checked)}
                  className="w-5 h-5 rounded border-[#7A5133] text-[#1C3049] mt-0.5 cursor-pointer"
                />
                <label htmlFor="cod-check" className="cursor-pointer">
                  <span className="font-bold text-[#573721] text-base block">
                    Paiement à la livraison (Pratique sénégalaise)
                  </span>
                  <span className="text-xs text-[#2A211A]/80 leading-relaxed block mt-1">
                    Le livreur règle le vendeur lors du retrait ou encaisse pour lui à votre porte. Vous ne payez rien tant que l'article n'est pas devant vous.
                  </span>
                </label>
              </div>

              {/* Mode de règlement */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#DDCDB6] text-xs">
                <span className="text-[#7A6A5C] font-semibold">Moyen de paiement à l’arrivée :</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#2A211A] bg-white px-2 py-1 rounded-md border border-[#DDCDB6]">
                    💵 Espèces
                  </span>
                  <div className="bg-white px-2 py-1 rounded-md border border-[#DDCDB6]">
                    <LogoWave className="h-4" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded-md border border-[#DDCDB6]">
                    <LogoOrangeMoney className="h-4" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded-md border border-[#DDCDB6]">
                    <LogoCard className="h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button variant="dark" size="lg" fullWidth type="submit" disabled={isOrdering}>
              {isOrdering ? (
                <span>Attribution du livreur en cours...</span>
              ) : (
                <span>Commander la livraison • Total : {formatCFA(totalAmount)}</span>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Map & Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-5 shadow-sm">
            <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-3">
              Récapitulatif de la commande
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6A5C]">Article :</span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(listing.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6A5C]">Frais de livraison ({parcelClass}) :</span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(deliveryFare)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A6A5C]">
                <span>Distance estimée :</span>
                <span className="font-bold tabular-nums text-[#2A211A]">{formatDistance(tripMetrics.distanceKm)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A6A5C]">
                <span>Délai de livraison :</span>
                <span className="font-bold tabular-nums text-[#2A211A]">{formatDuration(tripMetrics.durationMinutes)}</span>
              </div>
              <div className="pt-3 border-t border-[#DDCDB6] flex items-center justify-between text-base">
                <span className="font-bold text-[#573721]">Montant total à régler :</span>
                <span className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {formatCFA(totalAmount)}
                </span>
              </div>
            </div>

            {/* Map Preview */}
            <div className="pt-2">
              <RouteMap
                originId={originId}
                destinationId={destinationId}
                mode="colis"
                vehicleType={parcelClass}
                className="h-64 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {assignedDriver && (
        <CourierFound
          driver={assignedDriver}
          fare={totalAmount}
          type="colis"
          paymentMethod={paymentMethod}
          onClose={() => setAssignedDriver(null)}
        />
      )}
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center font-bold text-[#573721]">Préparation de la livraison...</div>}>
      <LivraisonContent />
    </Suspense>
  );
}
