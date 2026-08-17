'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from '@/components/ui/Icons';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const {
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

  const [activeProfileTab, setActiveProfileTab] = useState<'seller' | 'driver'>('seller');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<any>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
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

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer les modifications boutique</span>
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
                  <span className="text-xs text-[#E8DBC8]">
                    {driverVehicle} • Immatriculation : {driverPlate}
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

              <Field label="Enseigne / Nom de Flotte" helper="Ex: Diallo Express">
                <input
                  type="text"
                  value={driverFleetName}
                  onChange={(e) => setDriverFleetName(e.target.value)}
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

              <Field label="WhatsApp Professionnel direct" required helper="Pour être contacté instantanément">
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

              <Field label="Véhicule de livraison" required>
                <input
                  type="text"
                  required
                  value={driverVehicle}
                  onChange={(e) => setDriverVehicle(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="flex flex-col justify-end">
                <Link
                  href={`/chauffeur/${driverProfile.id}`}
                  target="_blank"
                  className="w-full min-h-[48px] px-4 rounded-[8px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#1C3049] font-bold text-xs flex items-center justify-center gap-2 border border-[#DDCDB6] transition-all"
                >
                  <span>👁️ Voir ma vitrine publique livreur</span>
                  <IconArrowRight className="w-4 h-4" />
                </Link>
              </div>
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

      {paymentModalOpen && targetUpgradePlan && (
        <FakePaymentModal
          title={`Activation : ${targetUpgradePlan.name}`}
          amount={targetUpgradePlan.price}
          description="Règlement factice sécurisé Wave / Orange Money pour la mise à jour immédiate de votre compte."
          onClose={() => {
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
          }}
          onSuccess={() => {
            if (targetUpgradePlan.id === 'boost') {
              showSuccessToast('Mise en avant activée pour 7 jours !');
            } else {
              setUserPlan(targetUpgradePlan.id);
              showSuccessToast(`Formule ${targetUpgradePlan.name} activée avec succès !`);
            }
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
          }}
        />
      )}
    </div>
  );
}
