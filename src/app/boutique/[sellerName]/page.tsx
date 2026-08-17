'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/Button';
import { GlowButton } from '@/components/ui/GlowButton';
import {
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconArrowLeft,
  IconPhone,
  IconStar,
  IconPackage,
  IconCheck,
} from '@/components/ui/Icons';
import { ChatModal } from '@/components/ChatModal';
import { ReviewsSection } from '@/components/ReviewsSection';

export default function SellerShopPage() {
  const params = useParams();
  const rawSellerParam = Array.isArray(params?.sellerName)
    ? params.sellerName[0]
    : (params?.sellerName as string) || 'Vendeur';
  const decodedSellerName = decodeURIComponent(rawSellerParam).replace(/-/g, ' ');

  const { listings, sellerProfile } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if viewing the current user's seller profile
  const isCurrentUserProfile =
    decodedSellerName.toLowerCase() === sellerProfile.shopName.toLowerCase() ||
    decodedSellerName.toLowerCase() === 'mon-profil' ||
    decodedSellerName.toLowerCase() === 'dakar-electro-boutique';

  // Find all listings belonging to this seller
  const sellerListings = listings.filter((l) =>
    l.sellerName.toLowerCase().includes(decodedSellerName.toLowerCase()) ||
    decodedSellerName.toLowerCase().includes(l.sellerName.toLowerCase())
  );

  const displayListings = sellerListings.length > 0
    ? sellerListings
    : listings.filter((l) => l.isVerifiedShop).slice(0, 6);

  const shopName = isCurrentUserProfile
    ? sellerProfile.shopName
    : sellerListings[0]?.sellerName || decodedSellerName;

  const ownerName = isCurrentUserProfile ? sellerProfile.name : 'Vendeur Certifié Dakar';
  const shopZone = isCurrentUserProfile ? 'Médina & Plateau' : sellerListings[0]?.neighborhood || 'Dakar';
  const shopSeniority = sellerListings[0]?.sellerSeniority || 'Membre vérifié depuis 2 ans';
  const isVerified = true;

  const avatarUrl = isCurrentUserProfile
    ? sellerProfile.avatarUrl
    : `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(shopName)}&backgroundColor=7a5133`;

  const coverUrl = isCurrentUserProfile
    ? sellerProfile.coverUrl
    : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80';

  const phone = isCurrentUserProfile ? sellerProfile.phone : '+221 77 645 28 19';
  const whatsapp = isCurrentUserProfile ? sellerProfile.whatsapp : '+221 77 645 28 19';
  const email = isCurrentUserProfile ? sellerProfile.email : 'contact@boutique-dakar.sn';

  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Breadcrumb back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/marche"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A6A5C] hover:text-[#573721] transition-colors"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Retour au marché général</span>
        </Link>

        {isCurrentUserProfile && (
          <Link href="/compte">
            <Button size="sm" variant="outline">
              <span>⚙️ Personnaliser ma vitrine</span>
            </Button>
          </Link>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SHOP HERO SHOWCASE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-[#DDCDB6] overflow-hidden shadow-sm">
        {/* Cover Banner */}
        <div className="h-44 sm:h-64 relative overflow-hidden bg-[#7A5133]">
          <img
            src={coverUrl}
            alt={shopName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
            <span className="text-[0.68rem] uppercase tracking-widest font-bold text-white bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
              🏬 Vitrine Officielle Marchand NovaSen
            </span>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#573721] font-bold text-xs shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              {copied ? '✓ Lien copié !' : '🔗 Partager la boutique'}
            </button>
          </div>
        </div>

        {/* Shop Info Row */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={shopName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-[20px] object-cover border-4 border-white shadow-xl bg-white"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-xs shadow-md">
                  ✓
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center flex-wrap gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
                    {shopName}
                  </h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C3049] text-white text-xs font-bold shadow-xs">
                      <IconShieldCheck className="w-4 h-4 text-[#C9A882]" />
                      <span>Vendeur Vérifié KYC</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A6A5C]">
                  <span className="flex items-center gap-1 font-semibold text-[#573721]">
                    <IconMapPin className="w-4 h-4 text-[#7A5133]" />
                    <span>{shopZone}, Dakar</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <IconStar className="w-3.5 h-3.5 fill-current" />
                    <span>4.9 / 5</span>
                    <span className="text-[#7A6A5C] font-normal">(48 avis vérifiés)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock className="w-4 h-4" />
                    <span>{shopSeniority}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp direct & Chat */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Bonjour ${shopName}, j'ai vu votre vitrine sur NovaSen !`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <span>💬 WhatsApp direct</span>
                <span className="text-[11px] opacity-80">({whatsapp})</span>
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 rounded-[10px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <IconPhone className="w-4 h-4 text-[#C9A882]" />
                <span>Appeler</span>
              </a>

              <Button
                variant="primary"
                onClick={() => setChatOpen(true)}
                className="text-xs min-h-[42px]"
              >
                <span>Messagerie interne</span>
              </Button>
            </div>
          </div>

          {/* Trust Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#DDCDB6]/60">
            <div className="p-3 rounded-[10px] bg-[#F2E9DC]/70 border border-[#DDCDB6] flex items-center gap-2.5">
              <span className="text-lg">🪪</span>
              <div>
                <span className="text-[11px] font-bold text-[#573721] block">Identité CNI</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <IconCheck className="w-2.5 h-2.5" /> Vérifiée
                </span>
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-[#F2E9DC]/70 border border-[#DDCDB6] flex items-center gap-2.5">
              <span className="text-lg">📄</span>
              <div>
                <span className="text-[11px] font-bold text-[#573721] block">NINEA / RCCM</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <IconCheck className="w-2.5 h-2.5" /> Déclaré
                </span>
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-[#F2E9DC]/70 border border-[#DDCDB6] flex items-center gap-2.5">
              <span className="text-lg">🌊</span>
              <div>
                <span className="text-[11px] font-bold text-[#573721] block">Reversement Wave</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <IconCheck className="w-2.5 h-2.5" /> Validé
                </span>
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-[#F2E9DC]/70 border border-[#DDCDB6] flex items-center gap-2.5">
              <span className="text-lg">📦</span>
              <div>
                <span className="text-[11px] font-bold text-[#573721] block">Paiement livraison</span>
                <span className="text-[10px] text-[#7A6A5C] font-semibold">
                  Via livreur NovaSen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SHOP CATALOG */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDCDB6]">
          <div className="flex items-center gap-2">
            <IconPackage className="w-5 h-5 text-[#7A5133]" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#573721]">
              Articles disponibles ({displayListings.length})
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#7A6A5C]">
            <span>Livraison assurée dans tout Dakar avec encaissement à la réception.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* REVIEWS & RATINGS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ReviewsSection
        targetId={shopName}
        targetName={shopName}
        targetType="seller"
        themeColor="#7A5133"
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        sellerName={shopName}
        sellerZone={`${shopZone}, Dakar`}
        listingTitle={`Vitrine de ${shopName}`}
      />
    </div>
  );
}
