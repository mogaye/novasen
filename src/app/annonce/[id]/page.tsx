'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { INITIAL_LISTINGS } from '@/lib/listings';
import { Listing, ZoneId } from '@/lib/types';
import { formatCFA, formatNumber } from '@/lib/format';
import { CategoryVisual } from '@/components/ui/CategoryVisual';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContactModal } from '@/components/ContactModal';
import { ChatModal } from '@/components/ChatModal';
import { MakeOfferModal } from '@/components/MakeOfferModal';
import { EarningsSimulator } from '@/components/EarningsSimulator';
import { GlowButton } from '@/components/ui/GlowButton';
import { supabase } from '@/lib/supabase';
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

export default function ListingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { listings } = useApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [contactOpen, setContactOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(undefined);

  // Fetch / find listing from memory, cache, or Supabase
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const cleanId = String(id).trim();

    // Check if ID is in blacklist of deleted listings
    if (typeof window !== 'undefined') {
      try {
        const savedDeleted = localStorage.getItem('novasen_deleted_listing_ids');
        if (savedDeleted) {
          const parsed: string[] = JSON.parse(savedDeleted);
          if (Array.isArray(parsed) && parsed.map((x) => String(x).trim()).includes(cleanId)) {
            setListing(null);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}
    }

    let isMounted = true;

    async function loadListing() {
      // 1. Search in AppContext in-memory listings
      const foundInMemory = listings.find((l) => String(l.id).trim() === cleanId);
      if (foundInMemory) {
        if (isMounted) {
          setListing(foundInMemory);
          setSelectedPhoto(foundInMemory.imageUrl || foundInMemory.images?.[0]);
          setLoading(false);
        }
        return;
      }

      // 2. Search in LocalStorage cache
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('novasen_custom_listings');
          if (cached) {
            const parsed: Listing[] = JSON.parse(cached);
            const foundInCache = parsed.find((l) => String(l.id).trim() === cleanId);
            if (foundInCache) {
              if (isMounted) {
                setListing(foundInCache);
                setSelectedPhoto(foundInCache.imageUrl || foundInCache.images?.[0]);
                setLoading(false);
              }
              return;
            }
          }
        } catch (e) {}
      }

      // 3. Search in INITIAL_LISTINGS
      const foundInInitial = INITIAL_LISTINGS.find((l) => String(l.id).trim() === cleanId);
      if (foundInInitial) {
        if (isMounted) {
          setListing(foundInInitial);
          setSelectedPhoto(foundInInitial.imageUrl || foundInInitial.images?.[0]);
          setLoading(false);
        }
        return;
      }

      // 4. Fetch directly from Supabase by ID / UUID
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', cleanId)
          .single();

        if (data && !error && isMounted) {
          const fetchedListing: Listing = {
            id: String(data.id),
            title: data.title || 'Annonce NovaSen',
            price: Number(data.price) || 0,
            category: data.category || 'vehicules',
            zoneId: (data.zone_id as ZoneId) || 'plateau',
            neighborhood: data.address || data.zone_id || 'Dakar',
            region: 'Dakar',
            condition: data.condition || 'Bon état',
            sellerName: data.phone || 'Vendeur NovaSen',
            sellerSeniority: 'Membre certifié',
            relativeDate: data.created_at
              ? new Date(data.created_at).toLocaleDateString('fr-FR')
              : "Aujourd'hui",
            description: data.description || '',
            isVerifiedShop: false,
            isFeatured: data.is_featured || false,
            imageUrl: data.images?.[0] || '',
            images: data.images && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []),
          };

          setListing(fetchedListing);
          setSelectedPhoto(fetchedListing.imageUrl || fetchedListing.images?.[0]);
        }
      } catch (err) {
        console.error('Error fetching listing by ID:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      isMounted = false;
    };
  }, [id, listings]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse flex flex-col gap-8">
        <div className="h-6 w-48 bg-[#E8DBC8] rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="h-80 bg-[#E8DBC8] rounded-xl" />
            <div className="h-40 bg-[#E8DBC8] rounded-xl" />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="h-60 bg-[#E8DBC8] rounded-xl" />
            <div className="h-40 bg-[#E8DBC8] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found fallback
  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center text-2xl font-bold">
          📍
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
            Annonce introuvable
          </h1>
          <p className="text-sm text-[#7A6A5C] max-w-md">
            Cette annonce n'existe plus ou a été retirée du marché NovaSen.
          </p>
        </div>
        <Link href="/marche">
          <Button variant="primary">
            <span>Explorer les annonces du marché</span>
            <IconArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const isVehicle = listing.category === 'vehicules';
  const isEligibleForEarnings = isVehicle && (listing.eligiblePassengers || listing.eligibleParcels);

  const allPhotos =
    listing.images && listing.images.length > 0
      ? listing.images
      : listing.imageUrl
      ? [listing.imageUrl]
      : [];

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
              className="h-72 sm:h-96 w-full rounded-[8px] overflow-hidden"
            />

            {/* Thumbnail selector if multiple images */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                      Année
                    </span>
                    <span className="font-bold text-[#2A211A]">{listing.year}</span>
                  </div>
                )}
                {listing.transmission && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                      Boîte
                    </span>
                    <span className="font-bold text-[#2A211A]">{listing.transmission}</span>
                  </div>
                )}
                {listing.fuel && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                      Carburant
                    </span>
                    <span className="font-bold text-[#2A211A]">{listing.fuel}</span>
                  </div>
                )}
                {listing.mileage !== undefined && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                      Kilométrage
                    </span>
                    <span className="font-bold tabular-nums text-[#1C3049]">
                      {formatNumber(listing.mileage)} km
                    </span>
                  </div>
                )}
                {listing.consumption && (
                  <div>
                    <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                      Consommation
                    </span>
                    <span className="font-bold text-[#2A211A]">{listing.consumption} L / 100km</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">
                    Type flotte
                  </span>
                  <span className="font-bold text-[#2A211A] capitalize">
                    {listing.vehicleType || 'Voiture'}
                  </span>
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
              {listing.description || "Aucune description détaillée n'a été fournie pour cette annonce."}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Seller & The 3 Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="condition">{listing.condition || 'Bon état'}</Badge>
                {listing.isVerifiedShop && <Badge variant="shop">Boutique vérifiée</Badge>}
                {listing.isFeatured && <Badge variant="featured">En avant</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721] leading-tight">
                {listing.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#7A6A5C] pt-1">
                <span className="flex items-center gap-1">
                  <IconMapPin className="w-4 h-4 text-[#7A5133]" />
                  <strong className="text-[#573721]">{listing.neighborhood || 'Dakar'}</strong>, {listing.region || 'Sénégal'}
                </span>
                <span className="flex items-center gap-1">
                  <IconClock className="w-4 h-4" />
                  {listing.relativeDate || "Aujourd'hui"}
                </span>
              </div>
            </div>

            {/* Price Tag & Stock Status */}
            <div className="p-4 bg-[#F2E9DC] rounded-[8px] border border-[#DDCDB6] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#7A6A5C]">Prix de vente</span>
                <span className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {formatCFA(listing.price || 0)}
                </span>
              </div>

              {/* Stock Status Indicator */}
              <div className="pt-2 border-t border-[#DDCDB6] flex items-center justify-between">
                <span className="text-xs text-[#7A6A5C] font-medium flex items-center gap-1.5">
                  <IconPackage className="w-4 h-4 text-[#7A5133]" />
                  <span>Disponibilité :</span>
                </span>
                {(() => {
                  const avail = Math.max(0, (listing.quantity ?? 1) - (listing.soldCount ?? 0));
                  if (avail <= 0) {
                    return (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Rupture de stock
                      </span>
                    );
                  }
                  if (avail === 1) {
                    return (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Dernier exemplaire disponible !
                      </span>
                    );
                  }
                  return (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      En stock ({avail} exemplaires)
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* LES ACTIONS PRINCIPALES */}
            <div className="flex flex-col gap-3">
              {/* Action 1 : Commander avec livraison immédiate NovaSen (Glow Button) */}
              {(() => {
                const avail = Math.max(0, (listing.quantity ?? 1) - (listing.soldCount ?? 0));
                if (avail <= 0) {
                  return (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 px-4 rounded-[8px] bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300"
                    >
                      <span>❌ Cet article est actuellement épuisé</span>
                    </button>
                  );
                }
                return (
                  <GlowButton
                    href={`/livraison?annonceId=${listing.id}&pickupZone=${listing.zoneId || 'plateau'}`}
                    variant="transport"
                    size="lg"
                    fullWidth
                  >
                    <span className="text-lg">🛵</span>
                    <span>Commander avec livraison NovaSen</span>
                    <IconArrowRight className="w-4 h-4 text-[#C9A882]" />
                  </GlowButton>
                );
              })()}

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
                  href={`/boutique/${encodeURIComponent(listing.sellerName || 'Vendeur')}`}
                  className="text-xs font-bold text-[#7A5133] hover:underline"
                >
                  Visiter la boutique →
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/boutique/${encodeURIComponent(listing.sellerName || 'Vendeur')}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {(listing.sellerName || 'V').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2A211A] group-hover:text-[#7A5133] transition-colors">
                      {listing.sellerName || 'Vendeur NovaSen'}
                    </h4>
                    <p className="text-xs text-[#7A6A5C]">
                      {listing.sellerSeniority || 'Membre NovaSen'} • {listing.neighborhood || 'Dakar'}
                    </p>
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
              Combien vous rapportera ce véhicule à {formatCFA(listing.price || 0)} ?
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
        sellerZone={`${listing.neighborhood || 'Dakar'}, Sénégal`}
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
