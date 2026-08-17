'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { SELLER_PLANS, FEATURED_LISTING_PRICE } from '@/lib/plans';
import { formatCFA } from '@/lib/format';
import { FakePaymentModal } from '@/components/FakePaymentModal';
import { Button } from '@/components/ui/Button';
import { GlowButton } from '@/components/ui/GlowButton';
import { EditListingModal } from '@/components/EditListingModal';
import { Listing } from '@/lib/types';
import {
  IconStar,
  IconPlus,
  IconShieldCheck,
  IconPackage,
  IconTrash,
  IconArrowRight,
  IconCheck,
  IconAlertCircle,
  IconMapPin,
  IconPhone,
} from '@/components/ui/Icons';

export default function MyBoutiquePage() {
  const { user } = useAuth();
  const {
    listings,
    deleteListing,
    updateListing,
    userPlan,
    setUserPlan,
    userListingsCount,
    featuredRemaining,
    useFeaturedCredit,
    sellerProfile,
    showSuccessToast,
  } = useApp();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<string | null>(null);

  const currentPlan = SELLER_PLANS.find((p) => p.id === userPlan) || SELLER_PLANS[0];
  const isQuotaReached = currentPlan.maxActiveListings !== -1 && userListingsCount >= currentPlan.maxActiveListings;
  const remainingSlots = currentPlan.maxActiveListings === -1 ? 999 : Math.max(0, currentPlan.maxActiveListings - userListingsCount);

  // Filter listings belonging to this seller/user
  const myCustomListings = listings.filter((l) => {
    const isCustom = String(l.id).startsWith('cust-') || String(l.id).length > 10;
    const isMatchingSeller =
      (sellerProfile.shopName && l.sellerName.toLowerCase().includes(sellerProfile.shopName.toLowerCase())) ||
      (sellerProfile.name && l.sellerName.toLowerCase().includes(sellerProfile.name.toLowerCase()));
    return isCustom || isMatchingSeller;
  });

  const displayListings = myCustomListings;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteListing(id);
    setDeletingId(null);
    setConfirmDeleteModal(null);
  };

  const handleBoost = (listingId: string) => {
    if (useFeaturedCredit()) {
      showSuccessToast('Crédit Boost appliqué sur votre annonce ! Elle est désormais en tête du marché.');
    } else {
      setPaymentModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 animate-page-reveal">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. SHOP HEADER & BRANDING */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-[20px] overflow-hidden border border-[#DDCDB6] bg-[#7A5133] shadow-md">
        {/* Cover Image */}
        <div className="h-44 sm:h-56 relative bg-gradient-to-r from-[#7A5133] to-[#573721]">
          {sellerProfile.coverUrl ? (
            <img
              src={sellerProfile.coverUrl}
              alt="Bannière Boutique"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-4xl">
              NOVASEN BOUTIQUE
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Link
              href="/compte"
              className="bg-white/90 hover:bg-white text-[#573721] px-4 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <span>⚙️ Paramètres de la boutique</span>
            </Link>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-[#DDCDB6]">
          <div className="flex items-start sm:items-end gap-5 -mt-16 sm:-mt-20">
            <div className="relative shrink-0">
              <img
                src={sellerProfile.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                alt="Logo Boutique"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-[18px] object-cover border-4 border-white shadow-xl bg-white"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-xs shadow-md">
                ✓
              </span>
            </div>

            <div className="flex flex-col gap-1 pt-2 sm:pt-0">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
                  {sellerProfile.shopName || 'Ma Boutique NovaSen'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-[4px] bg-[#E8DBC8] text-[#573721] text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-[#DDCDB6]">
                  <IconShieldCheck className="w-3.5 h-3.5 text-[#7A5133]" />
                  <span>{currentPlan.name}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7A6A5C]">
                Gérant : <strong>{sellerProfile.name || 'Vendeur Certifié'}</strong> • Contact : {sellerProfile.phone || '+221 78 913 90 36'} • Retrait : {sellerProfile.address || 'Dakar'}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <Link
              href={`/boutique/${encodeURIComponent(sellerProfile.shopName || 'ma-boutique')}`}
              target="_blank"
              className="px-4 py-2.5 rounded-[10px] bg-[#FAF8F5] hover:bg-[#E8DBC8] text-[#573721] font-bold text-xs border border-[#DDCDB6] transition-all flex items-center gap-2"
            >
              <span>👁️ Voir ma vitrine publique</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isQuotaReached ? (
              <Button
                variant="primary"
                onClick={() => setPaymentModalOpen(true)}
                className="bg-[#7A5133] hover:bg-[#573721]"
              >
                <IconStar className="w-4 h-4 text-[#E8DBC8]" />
                <span>Débloquer 30 annonces (6 500 F)</span>
              </Button>
            ) : (
              <GlowButton href="/publier" variant="market">
                <IconPlus className="w-4 h-4 text-[#E8DBC8]" />
                <span>+ Déposer une annonce</span>
              </GlowButton>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. QUOTA MONITOR & STATS BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Quota d'annonces */}
        <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">
              Quota d'annonces actives
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isQuotaReached ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
              {isQuotaReached ? 'Quota Atteint' : `${remainingSlots} place(s) libre(s)`}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {userListingsCount}
              </span>
              <span className="text-sm font-medium text-[#7A6A5C]">
                / {currentPlan.maxActiveListings === -1 ? 'Illimité (∞)' : `${currentPlan.maxActiveListings} max`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E8DBC8] h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isQuotaReached ? 'bg-red-500' : 'bg-[#7A5133]'
                }`}
                style={{
                  width: `${currentPlan.maxActiveListings === -1 ? 25 : Math.min(100, (userListingsCount / currentPlan.maxActiveListings) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDCDB6]/60 flex items-center justify-between text-xs">
            <span className="text-[#7A6A5C]">Formule : {currentPlan.name}</span>
            {userPlan === 'particulier' && (
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="text-[#7A5133] font-bold hover:underline cursor-pointer"
              >
                Passer à 30 annonces →
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Crédits Mises en avant */}
        <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">
              Mises en avant (Boost)
            </span>
            <IconStar className="w-4 h-4 text-amber-500 fill-current" />
          </div>

          <div>
            <div className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
              {featuredRemaining} <span className="text-sm font-normal text-[#7A6A5C]">disponible(s)</span>
            </div>
            <p className="text-xs text-[#7A6A5C] mt-2">
              Vos annonces boostées apparaissent en tête du Marché et de la page d'accueil de NovaSen.
            </p>
          </div>

          <div className="pt-3 border-t border-[#DDCDB6]/60 text-xs">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="text-[#7A5133] font-bold hover:underline cursor-pointer"
            >
              + Acheter un pack Boost (2 500 F)
            </button>
          </div>
        </div>

        {/* Card 3: Reversements & Ventes */}
        <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">
              Encaissements Wave & OM
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              0% Commission
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
              {formatCFA(245000)}
            </div>
            <p className="text-xs text-[#7A6A5C] mt-2">
              Reversé sur votre compte marchand Wave ({sellerProfile.phone || '+221 78 913 90 36'}).
            </p>
          </div>

          <div className="pt-3 border-t border-[#DDCDB6]/60 text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <IconCheck className="w-3.5 h-3.5" /> Paiements garantis NovaSen
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. LISTINGS MANAGER (VOIR, MODIFIER, SUPPRIMER, BOOSTER) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
                Catalogue de la boutique
              </span>
              <span className="bg-[#7A5133] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                {displayListings.length} annonce(s)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#573721] mt-1">
              Gérer mes articles & annonces en ligne
            </h2>
            <p className="text-xs text-[#7A6A5C]">
              Vous pouvez supprimer une annonce à tout moment pour libérer une place sur votre quota ou en créer de nouvelles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isQuotaReached ? (
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="px-4 py-2.5 rounded-[10px] bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <IconStar className="w-4 h-4 text-[#E8DBC8]" />
                <span>Passer à Boutique Pro (6 500 F)</span>
              </button>
            ) : (
              <Link
                href="/publier"
                className="px-4 py-2.5 rounded-[10px] bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <IconPlus className="w-4 h-4 text-[#E8DBC8]" />
                <span>+ Déposer une nouvelle annonce</span>
              </Link>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {displayListings.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-[#DDCDB6] rounded-[16px]">
            <div className="w-16 h-16 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center text-2xl font-bold">
              📦
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="text-lg font-bold font-heading text-[#573721]">
                Aucune annonce pour le moment
              </h3>
              <p className="text-xs text-[#7A6A5C]">
                Publiez votre premier article sur NovaSen et commencez à recevoir des demandes d'acheteurs à Dakar dès aujourd'hui.
              </p>
            </div>
            <Link href="/publier">
              <Button variant="primary">
                <IconPlus className="w-4 h-4" />
                <span>Déposer ma première annonce</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayListings.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF8F5] rounded-[14px] border border-[#DDCDB6] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#7A5133] transition-all group"
              >
                {/* Photo & Top Badges */}
                <div className="relative h-48 bg-[#E8DBC8] overflow-hidden">
                  <img
                    src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      En ligne
                    </span>
                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <IconStar className="w-3 h-3 fill-current" /> Boostée
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-[#1C3049]/90 text-white text-xs font-bold backdrop-blur-xs">
                    {formatCFA(item.price)}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase text-[#7A5133] tracking-wider">
                      {item.category} • {item.neighborhood || 'Dakar'}
                    </span>
                    {/* Stock badge */}
                    {(() => {
                      const avail = Math.max(0, (item.quantity ?? 1) - (item.soldCount ?? 0));
                      return (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            avail > 3
                              ? 'bg-emerald-100 text-emerald-800'
                              : avail > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          📦 Stock : {avail} rest.
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="font-bold text-[#573721] text-base line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A6A5C] line-clamp-2">
                    {item.description || 'Produit de qualité disponible à la vente immédiate.'}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="p-4 pt-3 border-t border-[#DDCDB6] flex items-center justify-between gap-2 bg-white">
                  <Link
                    href={`/annonce/${item.id}`}
                    target="_blank"
                    className="text-xs font-bold text-[#1C3049] hover:text-[#7A5133] flex items-center gap-1"
                  >
                    <span>👁️ Voir</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingListing(item)}
                      className="px-2.5 py-1.5 rounded-[6px] bg-[#FAF8F5] hover:bg-[#E8DBC8] text-[#573721] border border-[#DDCDB6] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Modifier les informations et le stock de l’annonce"
                    >
                      <span>✏️ Modifier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBoost(item.id)}
                      className="px-2.5 py-1.5 rounded-[6px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Mettre en avant cette annonce"
                    >
                      <IconStar className="w-3.5 h-3.5 text-[#7A5133]" />
                      <span>Booster</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteModal(item.id)}
                      disabled={deletingId === item.id}
                      className="px-2.5 py-1.5 rounded-[6px] bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Supprimer cette annonce"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                      <span>{deletingId === item.id ? '...' : 'Supprimer'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mx-auto">
              <IconTrash className="w-6 h-6" />
            </div>

            <div className="text-center flex flex-col gap-2">
              <h3 className="text-lg font-bold font-heading text-[#573721]">
                Supprimer cette annonce ?
              </h3>
              <p className="text-xs text-[#7A6A5C] leading-relaxed">
                Cette action supprimera définitivement l'annonce du Marché NovaSen et <strong>libérera immédiatement 1 place</strong> sur votre quota de publication.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteModal(null)}
                className="flex-1"
              >
                <span>Annuler</span>
              </Button>

              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteModal)}
                className="flex-1 py-2.5 px-4 rounded-[8px] bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <IconTrash className="w-4 h-4" />
                <span>Oui, supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL PAIEMENT WAVE / ORANGE MONEY (UPGRADE BOUTIQUE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {paymentModalOpen && (
        <FakePaymentModal
          title="Activation Boutique Pro (6 500 CFA / mois)"
          amount={6500}
          description="Passez à 30 annonces actives simultanées, badge Boutique Vérifiée et 1 Boost offert chaque mois."
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => {
            setUserPlan('boutique');
            setPaymentModalOpen(false);
            showSuccessToast('Formule Boutique Pro activée avec succès ! Vous pouvez maintenant déposer jusqu’à 30 annonces.');
          }}
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL ÉDITION D'ANNONCE & GESTION DU STOCK */}
      {/* ───────────────────────────────────────────────────────────── */}
      <EditListingModal
        isOpen={!!editingListing}
        listing={editingListing}
        onClose={() => setEditingListing(null)}
        onSave={updateListing}
      />
    </div>
  );
}
