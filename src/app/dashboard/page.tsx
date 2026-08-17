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
  IconMapPin,
} from '@/components/ui/Icons';

export default function DashboardPage() {
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
    listings,
    showSuccessToast,
  } = useApp();

  // Mode switcher: Vendeur vs Livreur
  const [dashboardRole, setDashboardRole] = useState<'seller' | 'driver'>('seller');
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

  // Upload handlers
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
        showSuccessToast('Bannière boutique mise à jour !');
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
    showSuccessToast('Profil Boutique Vendeur enregistré avec succès !');
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
    showSuccessToast('Profil Livreur enregistré avec succès !');
  };

  const handleUseBoost = () => {
    if (useFeaturedCredit()) {
      showSuccessToast('Crédit Boost appliqué sur vos annonces !');
    } else {
      setTargetUpgradePlan({
        name: 'Pack Mise en avant (7 jours)',
        price: FEATURED_LISTING_PRICE,
        id: 'boost',
      });
      setPaymentModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* DASHBOARD HEADER & ROLE SWITCHER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#1C3049] text-white rounded-[20px] border border-[#13223A] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="relative shrink-0">
            <img
              src={dashboardRole === 'seller' ? sellerAvatar : driverAvatar}
              alt="Profil"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-[18px] object-cover border-2 border-white shadow-lg bg-white"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-xs shadow-md">
              ✓
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                {dashboardRole === 'seller' ? sellerShopName : driverFullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C9A882] text-[#1C3049] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <IconShieldCheck className="w-3.5 h-3.5" />
                <span>Compte Vérifié 🛡️</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#E8DBC8]/80">
              {dashboardRole === 'seller'
                ? `Formule Boutique : ${currentSellerPlan.name} • Collecte à ${sellerProfile.address || 'Dakar'}`
                : `Formule Livreur : ${currentDriverPlan.name} • ${driverVehicle} (${driverPlate})`}
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher Pills */}
        <div className="flex bg-white/10 p-1 rounded-[12px] border border-white/20 z-10">
          <button
            type="button"
            onClick={() => setDashboardRole('seller')}
            className={`px-5 py-2.5 rounded-[9px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              dashboardRole === 'seller'
                ? 'bg-[#7A5133] text-white shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>🏬 Espace Vendeur</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardRole('driver')}
            className={`px-5 py-2.5 rounded-[9px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              dashboardRole === 'driver'
                ? 'bg-[#C9A882] text-[#1C3049] shadow-md font-extrabold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <span>🛵 Espace Livreur</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4 STATS CARDS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {dashboardRole === 'seller' ? (
        /* Vendeur Stats */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Formule Boutique</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#E8DBC8] text-[#573721] text-xs font-bold">
                {currentSellerPlan.name}
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {currentSellerPlan.price === 0 ? 'Gratuit' : `${formatCFA(currentSellerPlan.price)} / mois`}
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                {currentSellerPlan.commissionRate === 0 ? '0% de commission' : 'Commissions réduites'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60">
              <Link href="/vendeur" className="text-xs text-[#7A5133] font-bold hover:underline">
                Changer de formule →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Annonces Actives</span>
              <IconPackage className="w-4 h-4 text-[#7A5133]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {userListingsCount} <span className="text-sm font-normal text-[#7A6A5C]">articles</span>
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Visibles par tous les acheteurs de Dakar
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60">
              <Link href="/publier" className="text-xs text-[#7A5133] font-bold hover:underline">
                + Déposer une annonce
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Mises en avant Boost</span>
              <IconStar className="w-4 h-4 text-amber-500 fill-current" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {featuredRemaining} <span className="text-sm font-normal text-[#7A6A5C]">disponible(s)</span>
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Place vos articles en tête du marché
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60">
              <button
                type="button"
                onClick={handleUseBoost}
                className="text-xs text-[#7A5133] font-bold hover:underline cursor-pointer"
              >
                {featuredRemaining > 0 ? 'Activer un Boost' : 'Acheter un Boost (2 500 F)'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Ventes & Encaissements</span>
              <IconTrendingUp className="w-4 h-4 text-[#1C3049]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {formatCFA(245000)}
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Reversé sur Wave ({sellerProfile.phone})
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <IconCheck className="w-3.5 h-3.5" /> 8 commandes livrées
            </div>
          </div>
        </div>
      ) : (
        /* Livreur Stats */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Formule Chauffeur</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#1C3049] text-[#C9A882] text-xs font-bold">
                {currentDriverPlan.name}
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                {currentDriverPlan.price > 0 ? `${formatCFA(currentDriverPlan.price)} / jour` : 'Commission %'}
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Courses passagers et livraisons colis
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60">
              <Link href="/livreur" className="text-xs text-[#1C3049] font-bold hover:underline">
                Modifier formule →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Missions Effectuées</span>
              <IconCar className="w-4 h-4 text-[#1C3049]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                128 <span className="text-sm font-normal text-[#7A6A5C]">courses</span>
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Note moyenne : <strong className="text-amber-600 font-bold">★ 4.98 / 5</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60 text-xs text-[#7A6A5C]">
              Zone principale : Médina & Plateau
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Gains du Jour</span>
              <IconTrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading tabular-nums text-emerald-700">
                {formatCFA(18500)}
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                5 livraisons de colis achevées aujourd'hui
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60 text-xs text-[#7A6A5C]">
              Reversement instantané Wave
            </div>
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">Véhicule Déclaré</span>
              <span className="text-xs font-bold text-[#1C3049]">Conforme</span>
            </div>
            <div>
              <div className="text-lg font-bold text-[#1C3049] truncate">
                {driverVehicle}
              </div>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Plaque : <strong>{driverPlate}</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-[#DDCDB6]/60 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <IconShieldCheck className="w-3.5 h-3.5" /> Assurance AXA valide
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PUBLIC SHOWCASE EDITING SECTION (BANNER, AVATAR, CONTACTS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Personnalisation de votre Vitrine Publique
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#573721]">
              {dashboardRole === 'seller' ? 'Bannière, Logo & Coordonnées Vendeur' : 'Bannière, Photo & Coordonnées Livreur'}
            </h2>
          </div>

          <Link
            href={dashboardRole === 'seller' ? `/boutique/${encodeURIComponent(sellerShopName)}` : `/chauffeur/${driverProfile.id}`}
            target="_blank"
            className="px-4 py-2 rounded-[8px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#1C3049] font-bold text-xs flex items-center gap-2 border border-[#DDCDB6] transition-all"
          >
            <span>👁️ Voir ma vitrine publique en ligne</span>
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {dashboardRole === 'seller' ? (
          /* Seller Edit Form */
          <form onSubmit={handleSaveSeller} className="flex flex-col gap-6">
            <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] bg-[#7A5133] h-44 sm:h-56">
              <img
                src={sellerCover}
                alt="Bannière Vendeur"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              <label className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#573721] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer shadow-md backdrop-blur-md transition-all">
                <span>📸 Changer la bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSellerCoverUpload}
                  className="hidden"
                />
              </label>

              <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-4">
                <div className="relative">
                  <img
                    src={sellerAvatar}
                    alt="Logo Boutique"
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

              <Field label="Nom complet du gérant" required>
                <input
                  type="text"
                  required
                  value={sellerOwnerName}
                  onChange={(e) => setSellerOwnerName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro de Téléphone Appel (+221)" required>
                <input
                  type="text"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="WhatsApp Professionnel" required helper="Discussion instantanée avec l'acheteur">
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

              <Field label="Adresse exacte du point de collecte" required>
                <input
                  type="text"
                  required
                  value={sellerProfile.address || 'Rue 11 x Boulevard Général de Gaulle'}
                  onChange={(e) => updateSellerProfile({ address: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer les modifications boutique</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Driver Edit Form */
          <form onSubmit={handleSaveDriver} className="flex flex-col gap-6">
            <div className="relative rounded-[16px] overflow-hidden border border-[#DDCDB6] bg-[#1C3049] h-44 sm:h-56">
              <img
                src={driverCover}
                alt="Bannière Livreur"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              <label className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#1C3049] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer shadow-md backdrop-blur-md transition-all">
                <span>📸 Changer la bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDriverCoverUpload}
                  className="hidden"
                />
              </label>

              <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-4">
                <div className="relative">
                  <img
                    src={driverAvatar}
                    alt="Photo Livreur"
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

              <Field label="Modèle de véhicule" required>
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

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer les modifications livreur</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {paymentModalOpen && targetUpgradePlan && (
        <FakePaymentModal
          title={`Activation : ${targetUpgradePlan.name}`}
          amount={targetUpgradePlan.price}
          description="Règlement factice sécurisé Wave / Orange Money."
          onClose={() => {
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
          }}
          onSuccess={() => {
            if (targetUpgradePlan.id === 'boost') {
              showSuccessToast('Mise en avant Boost activée !');
            } else {
              setUserPlan(targetUpgradePlan.id);
              showSuccessToast(`Formule ${targetUpgradePlan.name} activée !`);
            }
            setPaymentModalOpen(false);
            setTargetUpgradePlan(null);
          }}
        />
      )}
    </div>
  );
}
