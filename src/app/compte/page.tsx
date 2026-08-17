'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SELLER_PLANS, DRIVER_PLANS, FEATURED_LISTING_PRICE } from '@/lib/plans';
import { formatCFA } from '@/lib/format';
import { FakePaymentModal } from '@/components/FakePaymentModal';
import { Button } from '@/components/ui/Button';
import { GlowButton } from '@/components/ui/GlowButton';
import { Field, inputClass } from '@/components/ui/Field';
import {
  IconUser,
  IconPlus,
  IconStar,
  IconShieldCheck,
  IconPackage,
  IconCar,
  IconCheck,
  IconTrendingUp,
  IconClock,
  IconArrowRight,
  IconPhone,
  IconTrash,
  IconMapPin,
  IconAlertCircle,
} from '@/components/ui/Icons';
import { useAuth } from '@/context/AuthContext';
import { DriverTrip, Listing } from '@/lib/types';
import { EditListingModal } from '@/components/EditListingModal';

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const {
    listings,
    deleteListing,
    updateListing,
    driverTrips,
    addDriverTrip,
    deleteDriverTrip,
    userPlan,
    setUserPlan,
    driverPlan,
    setDriverPlan,
    userListingsCount,
    featuredRemaining,
    useFeaturedCredit,
    sellerProfile,
    updateSellerProfile,
    driverProfile,
    updateDriverProfile,
    showSuccessToast,
  } = useApp();

  const searchParams = useSearchParams();
  const subscriptionSuccess = searchParams.get('subscription') === 'success';
  const urlPlanId = searchParams.get('plan');
  const urlPlanType = searchParams.get('type') as 'seller' | 'driver' | null;
  const urlPlanName = searchParams.get('name') || 'Plan';

  const [activeProfileTab, setActiveProfileTab] = useState<'seller' | 'driver'>(
    urlPlanType === 'driver' ? 'driver' : 'seller'
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<any>(null);
  const [confirmDeleteListingId, setConfirmDeleteListingId] = useState<string | null>(null);
  const [confirmDeleteTripId, setConfirmDeleteTripId] = useState<string | null>(null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [hasActivatedFromUrl, setHasActivatedFromUrl] = useState(false);

  useEffect(() => {
    if (subscriptionSuccess && !hasActivatedFromUrl) {
      setHasActivatedFromUrl(true);
      if (urlPlanType === 'driver' && urlPlanId) {
        setDriverPlan(urlPlanId as any);
        setActiveProfileTab('driver');
        showSuccessToast(`Formule chauffeur ${urlPlanName} activée avec succès !`);
      } else if (urlPlanId) {
        setUserPlan(urlPlanId as any);
        setActiveProfileTab('seller');
        showSuccessToast(`Formule boutique ${urlPlanName} activée avec succès !`);
      }
    }
  }, [subscriptionSuccess, urlPlanId, urlPlanType, urlPlanName, hasActivatedFromUrl, setDriverPlan, setUserPlan, showSuccessToast]);

  // New Driver Trip Form State
  const [newTripOrigin, setNewTripOrigin] = useState('Plateau / Centre-ville');
  const [newTripDestination, setNewTripDestination] = useState('Almadies / Ngor / Virage');
  const [newTripTime, setNewTripTime] = useState('Départ dans 30 min');
  const [newTripType, setNewTripType] = useState<'passagers' | 'colis' | 'mixte'>('passagers');
  const [newTripPrice, setNewTripPrice] = useState(3000);
  const [newTripSeats, setNewTripSeats] = useState(3);
  const [newTripVehicle, setNewTripVehicle] = useState('Voiture Climatisée');

  // Editable Seller State
  const [sellerShopName, setSellerShopName] = useState(sellerProfile.shopName);
  const [sellerOwnerName, setSellerOwnerName] = useState(sellerProfile.name);
  const [sellerPhone, setSellerPhone] = useState(sellerProfile.phone);
  const [sellerWhatsapp, setSellerWhatsapp] = useState(sellerProfile.whatsapp);
  const [sellerEmail, setSellerEmail] = useState(sellerProfile.email);
  const [sellerAvatar, setSellerAvatar] = useState(sellerProfile.avatarUrl);
  const [sellerCover, setSellerCover] = useState(sellerProfile.coverUrl);

  // Editable Driver State
  const [driverFullName, setDriverFullName] = useState(driverProfile.fullName);
  const [driverFleetName, setDriverFleetName] = useState(driverProfile.fleetName || '');
  const [driverPhone, setDriverPhone] = useState(driverProfile.phone);
  const [driverWhatsapp, setDriverWhatsapp] = useState(driverProfile.whatsapp);
  const [driverEmail, setDriverEmail] = useState(driverProfile.email);
  const [driverAvatar, setDriverAvatar] = useState(driverProfile.avatarUrl);
  const [driverCover, setDriverCover] = useState(driverProfile.coverUrl);
  const [driverVehicle, setDriverVehicle] = useState(driverProfile.vehicleModel);
  const [driverPlate, setDriverPlate] = useState(driverProfile.licensePlate);

  const currentSellerPlan = SELLER_PLANS.find((p) => p.id === userPlan) || SELLER_PLANS[0];
  const currentDriverPlan = DRIVER_PLANS.find((p) => p.id === driverPlan) || DRIVER_PLANS[0];

  const mySellerListings = listings.filter((l) => {
    const isCustom = String(l.id).startsWith('cust-') || String(l.id).length > 10;
    const isMatchingSeller =
      (sellerProfile.shopName && l.sellerName.toLowerCase().includes(sellerProfile.shopName.toLowerCase())) ||
      (sellerProfile.name && l.sellerName.toLowerCase().includes(sellerProfile.name.toLowerCase()));
    return isCustom || isMatchingSeller;
  });

  const handleSaveSeller = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile({
      shopName: sellerShopName,
      name: sellerOwnerName,
      phone: sellerPhone,
      whatsapp: sellerWhatsapp,
      email: sellerEmail,
      avatarUrl: sellerAvatar,
      coverUrl: sellerCover,
    });
    showSuccessToast('Profil Boutique Vendeur mis à jour avec succès !');
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    updateDriverProfile({
      fullName: driverFullName,
      fleetName: driverFleetName,
      phone: driverPhone,
      whatsapp: driverWhatsapp,
      email: driverEmail,
      avatarUrl: driverAvatar,
      coverUrl: driverCover,
      vehicleModel: driverVehicle,
      licensePlate: driverPlate,
    });
    showSuccessToast('Profil Chauffeur / Livreur mis à jour avec succès !');
  };

  const handleSellerAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setSellerAvatar(reader.result);
        updateSellerProfile({ avatarUrl: reader.result });
        showSuccessToast('Logo vendeur mis à jour !');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSellerCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setSellerCover(reader.result);
        updateSellerProfile({ coverUrl: reader.result });
        showSuccessToast('Bannière vendeur mise à jour !');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDriverAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setDriverAvatar(reader.result);
        updateDriverProfile({ avatarUrl: reader.result });
        showSuccessToast('Photo livreur mise à jour !');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDriverCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setDriverCover(reader.result);
        updateDriverProfile({ coverUrl: reader.result });
        showSuccessToast('Bannière livreur mise à jour !');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpgradeSeller = (plan: any) => {
    setTargetUpgradePlan(plan);
    setPaymentModalOpen(true);
  };

  const handleUseBoost = () => {
    if (useFeaturedCredit()) {
      showSuccessToast('Crédit de mise en avant appliqué avec succès sur votre annonce !');
    } else {
      setTargetUpgradePlan({
        name: 'Mise en avant (7 jours)',
        price: FEATURED_LISTING_PRICE,
        id: 'boost',
      });
      setPaymentModalOpen(true);
    }
  };

  const handleConfirmDeleteListing = async () => {
    if (confirmDeleteListingId) {
      await deleteListing(confirmDeleteListingId);
      setConfirmDeleteListingId(null);
    }
  };

  const handleConfirmDeleteTrip = async () => {
    if (confirmDeleteTripId) {
      await deleteDriverTrip(confirmDeleteTripId);
      setConfirmDeleteTripId(null);
    }
  };

  const handlePublishTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (driverPlan === 'none') {
      showSuccessToast('Veuillez activer votre forfait chauffeur (Pass 1 500 F ou Abonnement 25 000 F)');
      setTargetUpgradePlan(DRIVER_PLANS[0]);
      setPaymentModalOpen(true);
      setShowAddTripModal(false);
      return;
    }

    const res = await addDriverTrip({
      originZone: newTripOrigin,
      destinationZone: newTripDestination,
      departureTime: newTripTime,
      tripType: newTripType,
      price: Number(newTripPrice),
      availableSeats: newTripSeats,
      vehicleModel: newTripVehicle,
    });

    if (res.success) {
      setShowAddTripModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Subscription Celebration Banner */}
      {subscriptionSuccess && (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl font-bold shrink-0">
              🎉
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading">
                Félicitations ! Votre formule {urlPlanName} est active !
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100">
                Votre paiement PayDunya a bien été validé. Vos avantages, quotas et visibilité prioritaire sont immédiatement effectifs.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-xs shrink-0 self-start sm:self-auto">
            Statut : Abonné Actif ✓
          </div>
        </div>
      )}

      {/* Auth Status Notification Bar */}
      {user ? (
        <div className="bg-[#FAF7F2] border border-[#DDCDB6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7A5133]/15 text-[#7A5133] font-bold flex items-center justify-center text-sm">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-xs text-[#7A6A5C]">Connecté à votre compte NovaSen</p>
              <p className="text-sm font-bold text-[#573721]">
                {profile?.full_name || user.email} <span className="font-normal text-xs text-[#7A6A5C]">({user.email})</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 text-xs font-bold rounded-xl border border-red-200 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#7A5133]/10 via-[#FAF7F2] to-[#1C3049]/10 border border-[#DDCDB6] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-lg">
              🔐
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#573721]">Vous n&apos;êtes pas connecté</h3>
              <p className="text-xs text-[#7A6A5C]">
                Connectez-vous pour synchroniser vos annonces réelles, livraisons et négociations sur Supabase.
              </p>
            </div>
          </div>
          <Link
            href="/connexion?redirect=/compte"
            className="px-5 py-2.5 bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold rounded-xl transition shadow-sm text-center whitespace-nowrap"
          >
            Se connecter / Créer un compte
          </Link>
        </div>
      )}

      {/* Account Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#DDCDB6]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activeProfileTab === 'seller' ? sellerAvatar : driverAvatar}
              alt="Profil"
              className="w-16 h-16 rounded-[14px] object-cover border-2 border-white shadow-md bg-[#E8DBC8]"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
                {activeProfileTab === 'seller' ? sellerShopName : driverFullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-[4px] bg-[#1C3049] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <IconShieldCheck className="w-3.5 h-3.5 text-[#C9A882]" />
                <span>Profil certifié KYC</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A6A5C]">
              Compte marchand & Transporteur actif • Présence Nationale (14 Régions du Sénégal)
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[12px] bg-[#FAF8F5] hover:bg-[#E8DBC8] text-[#573721] text-xs sm:text-sm font-bold border border-[#DDCDB6] transition-all shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Assistance Opérateurs</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#1C3049] hover:bg-[#13223A] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <span>📊 Mon Dashboard</span>
            <IconArrowRight className="w-4 h-4 text-[#C9A882]" />
          </Link>
          <GlowButton href="/publier" variant="market" size="sm">
            <IconPlus className="w-4 h-4 text-[#E8DBC8]" />
            <span>Publier une annonce</span>
          </GlowButton>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION PROFIL PUBLIC & COORDONNÉES (PHOTOS & CONTACTS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Gestion de votre vitrine publique
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#573721]">
              Photos de profil, Couverture & Coordonnées de contact
            </h2>
          </div>

          {/* Switch Tab Vendeur / Livreur */}
          <div className="flex bg-[#E8DBC8] p-1 rounded-[10px] border border-[#DDCDB6]">
            <button
              type="button"
              onClick={() => setActiveProfileTab('seller')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                activeProfileTab === 'seller'
                  ? 'bg-[#7A5133] text-white shadow-xs'
                  : 'text-[#573721] hover:text-[#2A211A]'
              }`}
            >
              🏬 Boutique Vendeur
            </button>
            <button
              type="button"
              onClick={() => setActiveProfileTab('driver')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                activeProfileTab === 'driver'
                  ? 'bg-[#1C3049] text-white shadow-xs'
                  : 'text-[#1C3049] hover:text-[#13223A]'
              }`}
            >
              🛵 Profil Livreur / Chauffeur
            </button>
          </div>
        </div>

        {/* CONTENU ONGLET 1 : PROFIL VENDEUR */}
        {activeProfileTab === 'seller' ? (
          <form onSubmit={handleSaveSeller} className="flex flex-col gap-6">
            {/* Banner & Avatar Preview */}
            <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] bg-[#7A5133] h-48 sm:h-56">
              <img
                src={sellerCover}
                alt="Bannière Vendeur"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              {/* Cover Upload Button */}
              <label className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#573721] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer shadow-md backdrop-blur-md transition-all">
                <span>📸 Modifier la bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSellerCoverUpload}
                  className="hidden"
                />
              </label>

              {/* Floating Avatar & Shop Name Bottom Left */}
              <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-4">
                <div className="relative">
                  <img
                    src={sellerAvatar}
                    alt="Avatar Vendeur"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] object-cover border-4 border-white shadow-xl bg-white"
                  />
                  <label className="absolute -bottom-1 -right-1 bg-[#7A5133] hover:bg-[#573721] text-white p-1.5 rounded-full text-[11px] cursor-pointer shadow-md">
                    <span>✏️</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSellerAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-white flex flex-col">
                  <span className="text-lg sm:text-2xl font-bold font-heading">{sellerShopName}</span>
                  <span className="text-xs text-[#E8DBC8]">Gérant : {sellerOwnerName}</span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Nom de l'enseigne boutique" required>
                <input
                  type="text"
                  required
                  value={sellerShopName}
                  onChange={(e) => setSellerShopName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Nom du gérant" required>
                <input
                  type="text"
                  required
                  value={sellerOwnerName}
                  onChange={(e) => setSellerOwnerName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro Appel direct (+221)" required>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="WhatsApp Professionnel direct" required helper="Bouton WhatsApp sur votre boutique">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={sellerWhatsapp}
                    onChange={(e) => setSellerWhatsapp(e.target.value)}
                    className={inputClass}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                    💬 Actif
                  </span>
                </div>
              </Field>

              <Field label="Email de contact" required>
                <input
                  type="email"
                  required
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="flex flex-col justify-end">
                <Link
                  href={`/boutique/${encodeURIComponent(sellerShopName)}`}
                  target="_blank"
                  className="w-full min-h-[48px] px-4 rounded-[8px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] font-bold text-xs flex items-center justify-center gap-2 border border-[#DDCDB6] transition-all"
                >
                  <span>👁️ Voir ma vitrine publique vendeur</span>
                  <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* ─── SECTION MES ANNONCES VENDEUR ─── */}
            <div className="mt-4 pt-6 border-t border-[#DDCDB6] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#573721] flex items-center gap-2">
                    <span>📦 Mes Annonces en Ligne</span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-[#E8DBC8] text-[#573721] font-bold">
                      {userListingsCount} / {currentSellerPlan.maxActiveListings === -1 ? '∞' : `${currentSellerPlan.maxActiveListings} max`}
                    </span>
                  </h3>
                  <p className="text-xs text-[#7A6A5C]">
                    Supprimez une annonce pour libérer immédiatement une place sur votre quota ou ajoutez-en de nouvelles.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/boutique"
                    className="px-3 py-2 rounded-[8px] bg-[#FAF8F5] hover:bg-[#E8DBC8] text-[#573721] text-xs font-bold border border-[#DDCDB6] transition-all"
                  >
                    🏬 Espace Ma Boutique
                  </Link>
                  <Link
                    href="/publier"
                    className="px-3.5 py-2 rounded-[8px] bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>+ Publier une annonce</span>
                  </Link>
                </div>
              </div>

              {/* Listings Grid */}
              {mySellerListings.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] border border-[#DDCDB6] rounded-[12px]">
                  <p className="text-xs text-[#7A6A5C]">Vous n&apos;avez aucune annonce active actuellement.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mySellerListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F5] rounded-[12px] border border-[#DDCDB6] p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-[#7A5133] transition-all"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="w-16 h-16 rounded-[8px] object-cover shrink-0 bg-[#E8DBC8]"
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase text-[#7A5133] tracking-wider truncate">
                              {item.category}
                            </span>
                            {(() => {
                              const avail = Math.max(0, (item.quantity ?? 1) - (item.soldCount ?? 0));
                              return (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    avail > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  Stock: {avail}
                                </span>
                              );
                            })()}
                          </div>
                          <h4 className="font-bold text-[#573721] text-xs line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-xs font-bold text-[#1C3049] mt-1">
                            {formatCFA(item.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#DDCDB6]/60 text-xs">
                        <Link
                          href={`/annonce/${item.id}`}
                          target="_blank"
                          className="text-[#1C3049] hover:underline font-bold text-[11px]"
                        >
                          👁️ Voir
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingListing(item)}
                            className="text-[#7A5133] hover:text-[#573721] font-bold flex items-center gap-1 cursor-pointer text-[11px] bg-[#E8DBC8]/50 hover:bg-[#E8DBC8] px-2 py-0.5 rounded transition-colors"
                          >
                            <span>✏️ Modifier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteListingId(item.id)}
                            className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer text-[11px]"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer les coordonnées de la boutique</span>
              </Button>
            </div>
          </form>
        ) : (
          /* CONTENU ONGLET 2 : PROFIL LIVREUR */
          <form onSubmit={handleSaveDriver} className="flex flex-col gap-6">
            {/* Banner & Avatar Preview */}
            <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] bg-[#1C3049] h-48 sm:h-56">
              <img
                src={driverCover}
                alt="Bannière Livreur"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              {/* Cover Upload Button */}
              <label className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#1C3049] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer shadow-md backdrop-blur-md transition-all">
                <span>📸 Modifier la bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDriverCoverUpload}
                  className="hidden"
                />
              </label>

              {/* Floating Avatar & Driver Name Bottom Left */}
              <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-4">
                <div className="relative">
                  <img
                    src={driverAvatar}
                    alt="Avatar Livreur"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] object-cover border-4 border-white shadow-xl bg-white"
                  />
                  <label className="absolute -bottom-1 -right-1 bg-[#1C3049] hover:bg-[#13223A] text-white p-1.5 rounded-full text-[11px] cursor-pointer shadow-md">
                    <span>✏️</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDriverAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-white flex flex-col">
                  <span className="text-lg sm:text-2xl font-bold font-heading">{driverFullName}</span>
                  <span className="text-xs text-blue-200">
                    {driverVehicle} • Immat: {driverPlate}
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Nom complet du chauffeur" required>
                <input
                  type="text"
                  required
                  value={driverFullName}
                  onChange={(e) => setDriverFullName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Flotte / Enseigne (Optionnel)" helper="Ex: Taxi Express Dakar">
                <input
                  type="text"
                  value={driverFleetName}
                  onChange={(e) => setDriverFleetName(e.target.value)}
                  placeholder="Indépendant ou nom de groupement"
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro Appel direct (+221)" required>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="WhatsApp Professionnel" required helper="Contact direct pour courses">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={driverWhatsapp}
                    onChange={(e) => setDriverWhatsapp(e.target.value)}
                    className={inputClass}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                    💬 Actif
                  </span>
                </div>
              </Field>

              <Field label="Modèle du Véhicule" required>
                <input
                  type="text"
                  required
                  value={driverVehicle}
                  onChange={(e) => setDriverVehicle(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Immatriculation" required>
                <input
                  type="text"
                  required
                  value={driverPlate}
                  onChange={(e) => setDriverPlate(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* ─── SECTION MES ANNONCES DE TRAJETS CHAUFFEUR ─── */}
            <div className="mt-4 pt-6 border-t border-[#DDCDB6] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#1C3049] flex items-center gap-2">
                    <span>🛵 Mes Annonces de Trajets & Disponibilités</span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-[#1C3049] text-white font-bold">
                      {driverTrips.length} active(s)
                    </span>
                  </h3>
                  <p className="text-xs text-[#7A6A5C]">
                    Publiez vos départs ou trajets réguliers pour recevoir directement des réservations de passagers ou de colis.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTripModal(true)}
                    className="px-3.5 py-2 rounded-[8px] bg-[#1C3049] hover:bg-[#13223A] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>+ Publier un trajet</span>
                  </button>
                </div>
              </div>

              {/* Driver Trips Grid */}
              {driverTrips.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] border border-[#DDCDB6] rounded-[12px]">
                  <p className="text-xs text-[#7A6A5C]">Vous n'avez aucun trajet actif actuellement.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {driverTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-[#FAF8F5] rounded-[12px] border border-[#DDCDB6] p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-[#1C3049] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C3049] bg-blue-100 text-blue-800 px-2 py-0.5 rounded w-fit">
                            {trip.tripType === 'passagers' ? 'Passagers VTC' : trip.tripType === 'colis' ? 'Colis Express' : 'Mixte Passagers & Colis'}
                          </span>
                          <div className="font-bold text-sm text-[#1C3049] flex items-center gap-1.5 mt-1">
                            <span>{trip.originZone}</span>
                            <span className="text-[#7A6A5C]">➔</span>
                            <span>{trip.destinationZone}</span>
                          </div>
                          <p className="text-xs text-[#7A6A5C]">
                            🕒 {trip.departureTime} • {trip.vehicleModel}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-[#1C3049] bg-white px-2.5 py-1 rounded border border-[#DDCDB6] shadow-xs">
                          {formatCFA(trip.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#DDCDB6]/60 text-xs">
                        <span className="text-[#7A6A5C]">
                          {trip.availableSeats ? `${trip.availableSeats} place(s) dispo` : `${trip.maxWeightKg || 15} kg max`}
                        </span>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteTripId(trip.id)}
                          className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                          <span>Supprimer le trajet</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer les modifications livreur</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Formule en cours */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDCDB6] flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6A5C]">Formule Vendeur</span>
            <span className="px-2 py-0.5 rounded-[4px] bg-[#E8DBC8] text-[#573721] text-xs font-bold">
              {currentSellerPlan.name}
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
              {currentSellerPlan.price === 0 ? 'Gratuit' : `${formatCFA(currentSellerPlan.price)} / mois`}
            </div>
            <p className="text-xs text-[#7A6A5C] mt-1">
              {currentSellerPlan.commissionRate > 0
                ? `${currentSellerPlan.commissionRate * 100}% de commission sur les livraisons`
                : '0% de commission sur vos ventes'}
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDCDB6]/60">
            <span className="text-xs text-[#7A5133] font-semibold flex items-center gap-1">
              <IconCheck className="w-3.5 h-3.5" /> Compte actif
            </span>
          </div>
        </div>

        {/* 2. Annonces publiées */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDCDB6] flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6A5C]">Annonces actives</span>
            <IconPackage className="w-4 h-4 text-[#7A5133]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
              {userListingsCount}{' '}
              <span className="text-sm font-normal text-[#7A6A5C]">
                / {currentSellerPlan.maxActiveListings === -1 ? '∞' : currentSellerPlan.maxActiveListings}
              </span>
            </div>
            <p className="text-xs text-[#7A6A5C] mt-1">
              {currentSellerPlan.maxActiveListings === -1
                ? 'Publication illimitée'
                : `${Math.max(0, currentSellerPlan.maxActiveListings - userListingsCount)} restante(s)`}
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDCDB6]/60">
            <Link href="/publier" className="text-xs text-[#7A5133] font-bold hover:underline">
              + Ajouter un article
            </Link>
          </div>
        </div>

        {/* 3. Mises en avant */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDCDB6] flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6A5C]">Crédits Boost</span>
            <IconStar className="w-4 h-4 text-[#7A5133]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
              {featuredRemaining}{' '}
              <span className="text-sm font-normal text-[#7A6A5C]">disponible(s)</span>
            </div>
            <p className="text-xs text-[#7A6A5C] mt-1">
              Place vos annonces en tête du marché et de la page d'accueil
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDCDB6]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={handleUseBoost}
              className="text-xs text-[#7A5133] font-bold hover:underline cursor-pointer"
            >
              {featuredRemaining > 0 ? 'Utiliser un crédit' : 'Acheter un boost (2 500 F)'}
            </button>
          </div>
        </div>

        {/* 4. Gains & Reversements */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDCDB6] flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7A6A5C]">Ventes & Livraisons</span>
            <IconTrendingUp className="w-4 h-4 text-[#1C3049]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
              {formatCFA(245000)}
            </div>
            <p className="text-xs text-[#7A6A5C] mt-1">
              Encaissé et reversé par Wave / Orange Money ce mois-ci
            </p>
          </div>
          <div className="pt-2 border-t border-[#DDCDB6]/60">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <IconCheck className="w-3.5 h-3.5" /> 8 commandes livrées
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL CONFIRMATION SUPPRESSION ANNONCE VENDEUR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {confirmDeleteListingId && (
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
                onClick={() => setConfirmDeleteListingId(null)}
                className="flex-1"
              >
                <span>Annuler</span>
              </Button>

              <button
                type="button"
                onClick={handleConfirmDeleteListing}
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
      {/* MODAL CONFIRMATION SUPPRESSION TRAJET CHAUFFEUR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {confirmDeleteTripId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mx-auto">
              <IconTrash className="w-6 h-6" />
            </div>

            <div className="text-center flex flex-col gap-2">
              <h3 className="text-lg font-bold font-heading text-[#1C3049]">
                Supprimer cette annonce de trajet ?
              </h3>
              <p className="text-xs text-[#7A6A5C] leading-relaxed">
                Cette action retirera votre trajet des disponibilités visibles par les passagers et expéditeurs de colis.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteTripId(null)}
                className="flex-1"
              >
                <span>Annuler</span>
              </Button>

              <button
                type="button"
                onClick={handleConfirmDeleteTrip}
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
      {/* MODAL AJOUT RAPIDE TRAJET CHAUFFEUR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDCDB6] pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C3049]">Transport & VTC</span>
                <h3 className="text-xl font-bold font-heading text-[#1C3049]">
                  Publier une annonce de trajet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTripModal(false)}
                className="text-[#7A6A5C] hover:text-[#1C3049] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishTrip} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Zone de départ (Origine)" required>
                  <input
                    type="text"
                    required
                    value={newTripOrigin}
                    onChange={(e) => setNewTripOrigin(e.target.value)}
                    placeholder="Ex: Plateau, Médina..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Zone d'arrivée (Destination)" required>
                  <input
                    type="text"
                    required
                    value={newTripDestination}
                    onChange={(e) => setNewTripDestination(e.target.value)}
                    placeholder="Ex: Almadies, Aéroport..."
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Heure ou délai de départ" required>
                  <input
                    type="text"
                    required
                    value={newTripTime}
                    onChange={(e) => setNewTripTime(e.target.value)}
                    placeholder="Ex: Départ dans 30 min, 14h30..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Type d'offre" required>
                  <select
                    value={newTripType}
                    onChange={(e: any) => setNewTripType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="passagers">Passagers VTC</option>
                    <option value="colis">Colis Express</option>
                    <option value="mixte">Mixte Passagers & Colis</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Tarif proposé (FCFA)" required>
                  <input
                    type="number"
                    required
                    min={500}
                    step={500}
                    value={newTripPrice}
                    onChange={(e) => setNewTripPrice(Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>

                <Field label="Places dispo ou Poids max" required>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newTripSeats}
                    onChange={(e) => setNewTripSeats(Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Véhicule utilisé" required>
                <input
                  type="text"
                  required
                  value={newTripVehicle}
                  onChange={(e) => setNewTripVehicle(e.target.value)}
                  placeholder="Ex: Toyota Corolla climatisée, Scooter Honda..."
                  className={inputClass}
                />
              </Field>

              <div className="flex gap-3 pt-3 border-t border-[#DDCDB6]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddTripModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-[8px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Publier l'annonce de trajet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL PAIEMENT WAVE / ORANGE MONEY (UPGRADE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {paymentModalOpen && targetUpgradePlan && (
        <FakePaymentModal
          title={`Activation : ${targetUpgradePlan.name}`}
          amount={targetUpgradePlan.price}
          description="Règlement sécurisé PayDunya (Wave / Orange Money / CB) pour la mise à jour immédiate de votre compte."
          planId={targetUpgradePlan.id}
          planType={targetUpgradePlan.id === 'pass_jour' || targetUpgradePlan.id === 'abo_mensuel' || targetUpgradePlan.id === 'abo_annuel' ? 'driver' : 'seller'}
          onClose={() => {
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
          }}
          onSuccess={() => {
            if (targetUpgradePlan.id === 'boost') {
              showSuccessToast('Mise en avant activée pour 7 jours !');
            } else if (targetUpgradePlan.id === 'pass_jour' || targetUpgradePlan.id === 'abo_mensuel' || targetUpgradePlan.id === 'abo_annuel') {
              setDriverPlan(targetUpgradePlan.id);
              showSuccessToast(`Forfait Chauffeur ${targetUpgradePlan.name} activé avec succès !`);
            } else {
              setUserPlan(targetUpgradePlan.id);
              showSuccessToast(`Formule ${targetUpgradePlan.name} activée avec succès !`);
            }
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
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
