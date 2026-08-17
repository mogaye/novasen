'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { INITIAL_LISTINGS } from '@/lib/listings';
import { formatCFA, formatNumber } from '@/lib/format';
import { CategoryVisual } from '@/components/ui/CategoryVisual';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContactModal } from '@/components/ContactModal';
import { ChatModal } from '@/components/ChatModal';
import { MakeOfferModal } from '@/components/MakeOfferModal';
import { EarningsSimulator } from '@/components/EarningsSimulator';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconPackage,
  IconCar,
  IconFuel,
  IconGauge,
  IconArrowLeft,
  IconTrendingUp,
  IconPhone,
  IconCheck,
  IconArrowRight,
} from '@/components/ui/Icons';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { listings } = useApp();
  const [contactOpen, setContactOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  // Find listing from state or initial catalog
  const listing = listings.find((l) => l.id === id) || INITIAL_LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-[#573721]">Annonce introuvable</h1>
        <p className="text-[#7A6A5C]">Cette annonce n'existe plus ou a été retirée du marché.</p>
        <Link href="/marche">
          <Button variant="primary">Retourner au marché</Button>
        </Link>
      </div>
    );
  }

  const isVehicle = listing.category === 'vehicules';
  const isEligibleForEarnings = isVehicle && (listing.eligiblePassengers || listing.eligibleParcels);

  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(
    listing.imageUrl || listing.images?.[0]
  );

  const allPhotos = listing.images && listing.images.length > 0
    ? listing.images
    : listing.imageUrl ? [listing.imageUrl] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Breadcrumb back link */}
      <div>
        <Link
          href="/marche"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A6A5C] hover:text-[#573721] transition-colors"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue des annonces</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual & Description */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Main Visual & Gallery */}
          <div className="bg-white p-4 rounded-[12px] border border-[#DDCDB6] shadow-xs flex flex-col gap-3">
            <CategoryVisual
              category={listing.category}
              vehicleType={listing.vehicleType}
              imageUrl={selectedPhoto || listing.imageUrl || listing.images?.[0]}
              className="h-72 sm:h-96 w-full"
            />

            {/* Thumbnail selector if multiple images */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allPhotos.map((photo, pIdx) => (
                  <button
                    key={`thumb-${pIdx}`}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className={`w-16 h-16 rounded-[8px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      (selectedPhoto || allPhotos[0]) === photo
                        ? 'border-[#7A5133] ring-2 ring-[#7A5133]'
                        : 'border-[#DDCDB6] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Miniature" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Specifications for Vehicles */}
          {isVehicle && (
            <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
              <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-3">
                Fiche technique & Éligibilité Transport
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {listing.year && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Année</span>
                    <span className="font-bold text-[#2A211A]">{listing.year}</span>
                  </div>
                )}
                {listing.transmission && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Boîte</span>
                    <span className="font-bold text-[#2A211A]">{listing.transmission}</span>
                  </div>
                )}
                {listing.fuel && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Carburant</span>
                    <span className="font-bold text-[#2A211A]">{listing.fuel}</span>
                  </div>
                )}
                {listing.mileage !== undefined && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Kilométrage</span>
                    <span className="font-bold tabular-nums text-[#1C3049]">{formatNumber(listing.mileage)} km</span>
                  </div>
                )}
                {listing.consumption && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Consommation</span>
                    <span className="font-bold text-[#2A211A]">{listing.consumption} L / 100km</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Type flotte</span>
                  <span className="font-bold text-[#2A211A] capitalize">{listing.vehicleType || 'Voiture'}</span>
                </div>
              </div>

              {/* Badges of eligibility */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#DDCDB6]">
                {listing.eligiblePassengers && (
                  <Badge variant="passagers">Éligible Transport Passagers (VTC)</Badge>
                )}
                {listing.eligibleParcels && (
                  <Badge variant="parcels">Éligible Livraison & Messagerie Colis</Badge>
                )}
              </div>
            </div>
          )}

          {/* Description Block */}
          <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-3">
              Description de l’article
            </h3>
            <p className="text-sm text-[#2A211A] leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Seller & The 3 Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="condition">{listing.condition}</Badge>
                {listing.isVerifiedShop && <Badge variant="shop">Boutique vérifiée</Badge>}
                {listing.isFeatured && <Badge variant="featured">En avant</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721] leading-tight">
                {listing.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#7A6A5C] pt-1">
                <span className="flex items-center gap-1">
                  <IconMapPin className="w-4 h-4 text-[#7A5133]" />
                  <strong className="text-[#573721]">{listing.neighborhood}</strong>, {listing.region}
                </span>
                <span className="flex items-center gap-1">
                  <IconClock className="w-4 h-4" />
                  {listing.relativeDate}
                </span>
              </div>
            </div>

            {/* Price Tag */}
            <div className="p-4 bg-[#F2E9DC] rounded-[8px] border border-[#DDCDB6] flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[#7A6A5C]">Prix de vente</span>
              {/* RULE OF COLOR: Dark Blue Tabular Numbers */}
              <span className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {formatCFA(listing.price)}
              </span>
            </div>

            {/* LES ACTIONS PRINCIPALES */}
            <div className="flex flex-col gap-3">
              {/* Action 1 : Commander avec livraison immédiate NovaSen (Glow Button) */}
              <GlowButton
                href={`/livraison?annonceId=${listing.id}&pickupZone=${listing.zoneId}`}
                variant="transport"
                size="lg"
                fullWidth
              >
                <span className="text-lg">🛵</span>
                <span>Commander avec livraison NovaSen</span>
                <IconArrowRight className="w-4 h-4 text-[#C9A882]" />
              </GlowButton>

              {/* Action 2 : Discuter avec le vendeur (Espace Chat) */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setChatOpen(true)}
                className="min-h-[50px] bg-[#7A5133] hover:bg-[#573721] text-white border border-[#573721]"
              >
                <span className="text-base">💬</span>
                <span>Discuter avec le vendeur (Chat)</span>
              </Button>

              {/* Action 3 : Négocier & Faire une offre */}
              <button
                type="button"
                onClick={() => setOfferOpen(true)}
                className="w-full min-h-[46px] rounded-[8px] bg-[#FAF6F0] hover:bg-[#E8DBC8] text-[#573721] font-bold text-xs flex items-center justify-center gap-2 border border-[#DDCDB6] transition-colors cursor-pointer"
              >
                <span className="text-base">🤝</span>
                <span>Faire une offre de prix</span>
              </button>

              {/* Action 4 : Contacter par téléphone */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setContactOpen(true)}
                className="min-h-[46px] border border-[#DDCDB6] bg-white hover:bg-[#F2E9DC] text-[#573721]"
              >
                <IconPhone className="w-4 h-4 text-[#7A5133]" />
                <span>Voir le numéro de téléphone</span>
              </Button>

              {/* Action 5 : Simuler mes revenus (si véhicule éligible) */}
              {isEligibleForEarnings && (
                <button
                  type="button"
                  onClick={() => setShowSimulator(!showSimulator)}
                  className="w-full min-h-[44px] px-4 rounded-[6px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#1C3049] font-bold text-xs flex items-center justify-center gap-2 border border-[#DDCDB6] transition-colors cursor-pointer"
                >
                  <IconTrendingUp className="w-4 h-4 text-[#1C3049]" />
                  <span>{showSimulator ? 'Masquer le simulateur' : 'Simuler mes revenus avec ce véhicule'}</span>
                </button>
              )}
            </div>

            {/* Seller profile box with direct link to their shop */}
            <div className="pt-6 border-t border-[#DDCDB6] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6A5C]">
                  Vendeur certifié
                </span>
                <Link
                  href={`/boutique/${encodeURIComponent(listing.sellerName)}`}
                  className="text-xs font-bold text-[#7A5133] hover:underline"
                >
                  Visiter la boutique →
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/boutique/${encodeURIComponent(listing.sellerName)}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2A211A] group-hover:text-[#7A5133] transition-colors">
                      {listing.sellerName}
                    </h4>
                    <p className="text-xs text-[#7A6A5C]">{listing.sellerSeniority} • {listing.neighborhood}</p>
                  </div>
                </Link>
                {listing.isVerifiedShop && (
                  <span className="text-xs font-bold text-[#1C3049] flex items-center gap-1 bg-[#E8DBC8] px-2 py-1 rounded-[4px] border border-[#DDCDB6]">
                    <IconShieldCheck className="w-3.5 h-3.5 text-[#7A5133]" />
                    <span>Vérifié</span>
                  </span>
                )}
              </div>
            </div>

            {/* Delivery Guarantee Info */}
            <div className="bg-[#E8DBC8]/60 p-3.5 rounded-[8px] border border-[#DDCDB6] text-xs text-[#2A211A] flex items-start gap-2">
              <IconCheck className="w-4 h-4 text-[#7A5133] shrink-0 mt-0.5" />
              <span>
                <strong>Paiement à la livraison (COD) :</strong> le coursier NovaSen inspecte le colis chez le vendeur, vous livre à domicile et encaisse en espèces ou Wave.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Simulator Section if toggled or for eligible vehicles */}
      {isEligibleForEarnings && showSimulator && (
        <section className="mt-8 border-t border-[#DDCDB6] pt-10 animate-fade-in">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Calculateur personnalisé pour cette annonce
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
              Combien vous rapportera ce véhicule à {formatCFA(listing.price)} ?
            </h2>
          </div>

          <EarningsSimulator
            initialVehiclePrice={listing.price}
            initialFuelType={listing.fuel}
            initialConsumption={listing.consumption}
            initialMode={listing.vehicleType === 'moto' ? 'colis' : 'passagers'}
          />
        </section>
      )}

      {/* Contact modal */}
      {contactOpen && (
        <ContactModal listing={listing} onClose={() => setContactOpen(false)} />
      )}

      {/* Live Chat Modal */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        listingTitle={listing.title}
        listingPrice={listing.price}
        sellerName={listing.sellerName}
        sellerZone={`${listing.neighborhood}, Dakar`}
      />

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={offerOpen}
        onClose={() => setOfferOpen(false)}
        listingTitle={listing.title}
        initialPrice={listing.price}
        sellerName={listing.sellerName}
      />
    </div>
  );
}
