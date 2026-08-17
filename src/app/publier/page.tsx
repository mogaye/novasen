'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CategoryId, Condition, FuelType, TransmissionType, ZoneId } from '@/lib/types';
import { ZONES } from '@/lib/zones';
import { CATEGORIES } from '@/lib/listings';
import { SELLER_PLANS } from '@/lib/plans';
import { formatCFA } from '@/lib/format';
import { QuotaBanner } from '@/components/QuotaBanner';
import { Field, inputClass, selectClass } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import {
  IconStar,
  IconCheck,
  IconCar,
  IconSmartphone,
  IconLaptop,
  IconHome,
  IconArmchair,
  IconShirt,
  IconWrench,
  IconShieldCheck,
  IconArrowRight,
  IconArrowLeft,
  IconPackage,
  IconX,
} from '@/components/ui/Icons';

export default function PublishPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    userPlan,
    userListingsCount,
    addListing,
    showSuccessToast,
    isSellerRegistered,
    setIsSellerRegistered,
    sellerShopName,
    setSellerShopName,
  } = useApp();

  const planConfig = SELLER_PLANS.find((p) => p.id === userPlan) || SELLER_PLANS[0];
  const isQuotaReached = planConfig.maxActiveListings !== -1 && userListingsCount >= planConfig.maxActiveListings;

  // Quick onboarding gate state for new sellers
  const [quickSellerName, setQuickSellerName] = useState('Boutique Teranga');
  const [quickZoneId, setQuickZoneId] = useState<ZoneId>('medina');
  const [quickPhone, setQuickPhone] = useState('77 645 28 19');
  const [quickPayout, setQuickPayout] = useState<'wave' | 'orange_money'>('wave');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [category, setCategory] = useState<CategoryId>('telephones');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('Occasion');
  const [zoneId, setZoneId] = useState<ZoneId>('medina');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState(sellerShopName || 'Boutique Teranga');
  const [allowDelivery, setAllowDelivery] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Photo uploads state (up to 5 photos)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Vehicle specific state
  const [year, setYear] = useState('2020');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatique');
  const [fuel, setFuel] = useState<FuelType>('Essence');
  const [mileage, setMileage] = useState('45000');
  const [consumption, setConsumption] = useState('6.5');
  const [eligiblePassengers, setEligiblePassengers] = useState(true);
  const [eligibleParcels, setEligibleParcels] = useState(true);
  const [vehicleType, setVehicleType] = useState<'moto' | 'voiture' | 'camionnette'>('voiture');

  const [submitted, setSubmitted] = useState(false);

  const processFiles = (files: File[]) => {
    const remainingSlots = 5 - uploadedPhotos.length;
    if (remainingSlots <= 0) return;

    const filesToRead = files.slice(0, remainingSlots);
    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow selecting same file again
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleAddSamplePhoto = (sampleUrl: string) => {
    if (uploadedPhotos.length < 5) {
      setUploadedPhotos((prev) => [...prev, sampleUrl].slice(0, 5));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickSellerActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Veuillez accepter les conditions vendeur NovaSen.');
      return;
    }
    setIsSellerRegistered(true);
    setSellerShopName(quickSellerName);
    setSellerName(quickSellerName);
    setZoneId(quickZoneId);
    showSuccessToast('Profil Vendeur activé avec 3 annonces gratuites !');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isQuotaReached) return;

    const res = await addListing({
      title: title || 'Nouvel article en vente',
      price: Number(price) || 0,
      category,
      zoneId,
      neighborhood: ZONES.find((z) => z.id === zoneId)?.name || 'Dakar',
      condition,
      description: brand ? `[Marque: ${brand}] ${description}` : description,
      sellerName: sellerName || quickSellerName || 'Vendeur Vérifié',
      isFeatured,
      imageUrl: uploadedPhotos[0] || undefined,
      images: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
      ...(category === 'vehicules'
        ? {
            year: Number(year),
            transmission,
            fuel,
            mileage: Number(mileage),
            consumption: Number(consumption),
            eligiblePassengers,
            eligibleParcels,
            vehicleType,
          }
        : {}),
    });

    if (res.success) {
      setSubmitted(true);
      showSuccessToast('Votre annonce a été publiée avec succès !');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 1 : ACTIVATION VENDEUR OBLIGATOIRE
  // ─────────────────────────────────────────────────────────────────────────
  if (!isSellerRegistered) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 animate-fade-in">
        <div className="text-center flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[999px] bg-[#E8DBC8] text-[#7A5133] text-xs font-bold uppercase tracking-wider mx-auto border border-[#DDCDB6]">
            <IconShieldCheck className="w-4 h-4" />
            <span>Activation requise pour déposer des annonces</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#573721]">
            Devenez Vendeur NovaSen
          </h1>
          <p className="text-sm text-[#7A6A5C] max-w-xl mx-auto leading-relaxed">
            Pour garantir la sécurité des transactions et permettre aux livreurs d'encaisser et de reverser l'argent de vos ventes, vous devez d'abord activer votre profil vendeur (<strong>3 annonces gratuites offertes</strong>).
          </p>
        </div>

        <form
          onSubmit={handleQuickSellerActivation}
          className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 sm:p-8 shadow-sm flex flex-col gap-6"
        >
          <div className="flex items-center justify-between border-b border-[#DDCDB6] pb-3">
            <h3 className="font-bold text-lg font-heading text-[#573721]">
              Activation rapide (Gratuit • 30 secondes)
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px] border border-emerald-200">
              Formule Particulier (0 CFA)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom de votre profil vendeur ou boutique" required>
              <input
                type="text"
                required
                value={quickSellerName}
                onChange={(e) => setQuickSellerName(e.target.value)}
                placeholder="Ex: Boutique Teranga Dakar"
                className={inputClass}
              />
            </Field>

            <Field label="Quartier principal à Dakar" required helper="Où le livreur viendra chercher vos colis">
              <select
                value={quickZoneId}
                onChange={(e) => setQuickZoneId(e.target.value as ZoneId)}
                className={selectClass}
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mode de versement des ventes" required>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setQuickPayout('wave')}
                  className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold border transition-all ${
                    quickPayout === 'wave'
                      ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-xs'
                      : 'bg-[#F2E9DC] text-[#7A6A5C] border-[#DDCDB6]'
                  }`}
                >
                  🌊 Wave Sénégal
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPayout('orange_money')}
                  className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold border transition-all ${
                    quickPayout === 'orange_money'
                      ? 'bg-[#7A5133] text-white border-[#7A5133] shadow-xs'
                      : 'bg-[#F2E9DC] text-[#7A6A5C] border-[#DDCDB6]'
                  }`}
                >
                  🟠 Orange Money
                </button>
              </div>
            </Field>

            <Field label="Numéro Wave / OM (+221)" required helper="Pour recevoir les gains encaissés par coursier">
              <input
                type="text"
                required
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                placeholder="Ex: 77 645 28 19"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-[8px] bg-[#F2E9DC] border border-[#DDCDB6]">
            <input
              type="checkbox"
              id="quick-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded text-[#7A5133] mt-0.5 cursor-pointer"
            />
            <label htmlFor="quick-terms" className="text-xs text-[#573721] cursor-pointer leading-relaxed">
              J'accepte les conditions générales d'utilisation de NovaSen et certifie proposer des produits légitimes.
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DDCDB6]">
            <Link
              href="/vendeur"
              className="text-xs font-bold text-[#7A5133] hover:underline"
            >
              Ou ouvrir une Boutique Pro certifiée (Formules illimitées) →
            </Link>

            <Button type="submit" variant="primary" className="w-full sm:w-auto min-w-[200px]">
              <span>Activer et Déposer mon annonce</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 2 : ANNONCE PUBLIÉE AVEC SUCCÈS
  // ─────────────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold text-2xl shadow-md">
          <IconCheck className="w-8 h-8 text-[#E8DBC8]" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-heading text-[#573721]">
            Annonce publiée avec succès !
          </h1>
          <p className="text-sm text-[#7A6A5C]">
            Votre annonce « <strong>{title}</strong> » est désormais visible par tous les acheteurs de Dakar.
          </p>
        </div>

        <div className="bg-[#E8DBC8] p-5 rounded-[8px] border border-[#DDCDB6] w-full text-left flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#7A6A5C]">Prix fixé :</span>
            <strong className="text-sm font-bold tabular-nums text-[#1C3049]">
              {formatCFA(Number(price) || 0)}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A5C]">Vendeur :</span>
            <strong className="text-[#573721]">{sellerName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A5C]">Photos publiées :</span>
            <strong className="text-[#573721]">{uploadedPhotos.length} photo(s)</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A6A5C]">Livraison & Encaissement COD :</span>
            <strong className="text-[#1C3049]">Disponible immédiatement</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4">
          <Link href="/marche" className="flex-1">
            <Button variant="primary" className="w-full">
              <span>Voir sur le marché</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setTitle('');
              setPrice('');
              setDescription('');
            }}
          >
            <span>Déposer une autre annonce</span>
          </Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CAS 3 : FORMULAIRE DE DÉPÔT D'ANNONCE COMPLET AVEC PHOTOS & INFOS PRODUIT
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Top Quota Banner */}
      <QuotaBanner
        currentCount={userListingsCount}
        maxCount={planConfig.maxActiveListings}
        planName={planConfig.name}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[#DDCDB6]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-bold font-heading text-[#573721] tracking-tight">
            Déposer une annonce sur NovaSen
          </h1>
          <span className="text-xs bg-[#E8DBC8] text-[#573721] px-3 py-1 rounded-full font-bold border border-[#DDCDB6]">
            Vendeur : {sellerName}
          </span>
        </div>
        <p className="text-sm text-[#7A6A5C]">
          Ajoutez des photos nettes et décrivez précisément votre produit pour vendre rapidement à Dakar.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-3 gap-2 bg-[#E8DBC8] p-1.5 rounded-[8px] border border-[#DDCDB6] text-xs font-bold uppercase tracking-wider text-center">
        <div className={`py-2.5 rounded-[6px] ${step === 1 ? 'bg-[#7A5133] text-white font-bold' : 'text-[#573721]'}`}>
          1. Catégorie & Photos
        </div>
        <div className={`py-2.5 rounded-[6px] ${step === 2 ? 'bg-[#7A5133] text-white font-bold' : 'text-[#573721]'}`}>
          2. Infos Produit & Prix
        </div>
        <div className={`py-2.5 rounded-[6px] ${step === 3 ? 'bg-[#7A5133] text-white font-bold' : 'text-[#573721]'}`}>
          3. Options & Mise en avant
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {/* STEP 1: CATEGORY SELECTION & PHOTO UPLOAD SPACE */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#DDCDB6] flex flex-col gap-8 shadow-xs animate-fade-in">
            {/* Category selection */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-2">
                1. Choisissez la catégorie de votre produit
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-[8px] border text-left flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#7A5133] bg-[#E8DBC8]/50 ring-2 ring-[#7A5133]'
                          : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-bold text-[#573721] text-center">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Upload Space (Dedicated Espace Photos) */}
            <div className="flex flex-col gap-4 border-t border-[#DDCDB6] pt-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-lg font-heading text-[#573721] flex items-center gap-2">
                    <span>2. Photos du produit ({uploadedPhotos.length} / 5)</span>
                    {uploadedPhotos.length > 0 && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        ✓ {uploadedPhotos.length} photo(s) ajoutée(s)
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#7A6A5C]">
                    Glissez vos photos depuis votre téléphone ou ordinateur (JPG, PNG, WebP).
                  </p>
                </div>
                <span className="text-xs font-bold text-[#7A5133] bg-[#E8DBC8] px-2.5 py-1 rounded-[6px]">
                  Max 5 Mo / photo
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-file-input"
              />

              {/* Drag & Drop Large Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-[12px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                  isDragging
                    ? 'border-[#7A5133] bg-[#E8DBC8]/60 scale-[1.01]'
                    : 'border-[#C9A882] hover:border-[#7A5133] bg-[#FAF6F0] hover:bg-[#F2E9DC]/60'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#E8DBC8] text-2xl flex items-center justify-center shadow-xs">
                  📸
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-[#573721]">
                    Cliquez ici ou glissez vos photos pour les ajouter
                  </span>
                  <span className="text-xs text-[#7A6A5C]">
                    Prendre une photo avec l'appareil ou choisir depuis votre galerie
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-[6px] bg-[#7A5133] hover:bg-[#573721] text-white font-bold text-xs shadow-xs"
                >
                  + Parcourir mes fichiers / Galerie
                </button>
              </div>

              {/* Photo Preview Grid */}
              {uploadedPhotos.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-xs font-bold text-[#573721]">Photos sélectionnées :</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {uploadedPhotos.map((photo, index) => (
                      <div
                        key={`photo-${index}`}
                        className="relative rounded-[8px] overflow-hidden border-2 border-[#DDCDB6] group aspect-square bg-[#F2E9DC] shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Badge Photo Principale */}
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#7A5133] text-white text-[0.62rem] font-bold px-1.5 py-0.5 rounded-[4px] shadow-xs">
                            Principale
                          </span>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(index);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Supprimer la photo"
                        >
                          <IconX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add More Button if < 5 */}
                    {uploadedPhotos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#C9A882] hover:border-[#7A5133] bg-[#F2E9DC]/60 hover:bg-[#F2E9DC] rounded-[8px] aspect-square flex flex-col items-center justify-center gap-1 text-[#7A5133] transition-all cursor-pointer p-3 text-center"
                      >
                        <span className="text-xl">➕</span>
                        <span className="text-[0.72rem] font-bold">Ajouter</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Fast Samples Selector if user doesn't have an image file ready */}
              <div className="p-3.5 rounded-[8px] bg-[#FAF6F0] border border-[#DDCDB6] flex flex-col gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#7A6A5C]">
                  Ou ajouter une photo modèle en 1 clic :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhoto('/images/market_hero.jpg')}
                    className="px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#E8DBC8] border border-[#DDCDB6] text-[0.72rem] font-semibold text-[#573721] cursor-pointer"
                  >
                    📱 Smartphone
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhoto('/images/transport_hero.jpg')}
                    className="px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#E8DBC8] border border-[#DDCDB6] text-[0.72rem] font-semibold text-[#573721] cursor-pointer"
                  >
                    🛵 Véhicule / Moto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhoto('/images/market_hero.jpg')}
                    className="px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#E8DBC8] border border-[#DDCDB6] text-[0.72rem] font-semibold text-[#573721] cursor-pointer"
                  >
                    👗 Bazin & Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhoto('/images/transport_hero.jpg')}
                    className="px-2.5 py-1 rounded-[6px] bg-white hover:bg-[#E8DBC8] border border-[#DDCDB6] text-[0.72rem] font-semibold text-[#573721] cursor-pointer"
                  >
                    🌾 Vivres & Terroir
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#DDCDB6]">
              <Button type="button" variant="primary" onClick={() => setStep(2)}>
                <span>Continuer vers les détails</span>
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: RICH PRODUCT DETAILS & PRICING */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#DDCDB6] flex flex-col gap-6 shadow-xs animate-fade-in">
            <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-2">
              Informations détaillées sur le produit ({CATEGORIES.find((c) => c.id === category)?.name})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Field label="Titre de l’annonce" required helper="Ex: iPhone 13 Pro 128 Go Bleu Pacifique">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre clair et précis..."
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Marque / Fabricant" helper="Ex: Apple, Samsung, Honda, Toyota, Bazin...">
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Apple"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Prix de vente (FCFA)" required helper="Montant encaissé par le livreur">
                <input
                  type="number"
                  required
                  min="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 350000"
                  className={inputClass}
                />
              </Field>

              <Field label="État de l’objet" required>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                  className={selectClass}
                >
                  <option value="Neuf">Neuf (dans l'emballage d'origine)</option>
                  <option value="Comme neuf">Comme neuf (très peu utilisé)</option>
                  <option value="Bon état">Bon état (fonctionne parfaitement)</option>
                  <option value="Pour pièces">Pour pièces / À réparer</option>
                </select>
              </Field>

              <Field label="Quartier à Dakar" required helper="Lieu de collecte pour le coursier">
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value as ZoneId)}
                  className={selectClass}
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Vehicle specific fields */}
            {category === 'vehicules' && (
              <div className="bg-[#F2E9DC] p-5 rounded-[8px] border border-[#DDCDB6] flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1C3049] border-b border-[#DDCDB6] pb-2">
                  <IconCar className="w-5 h-5" />
                  <span>Spécifications du véhicule & Éligibilité transport</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Type de véhicule" required>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as 'moto' | 'voiture' | 'camionnette')}
                      className={selectClass}
                    >
                      <option value="moto">Scooter / Moto (Colis & Rapide)</option>
                      <option value="voiture">Berline / VTC (Passagers)</option>
                      <option value="camionnette">Camionnette (Fret)</option>
                    </select>
                  </Field>

                  <Field label="Année de mise en circulation" required>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Kilométrage (km)">
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            )}

            <Field label="Description détaillée" required helper="Mentionnez l’état réel, l'autonomie, les accessoires fournis...">
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre produit en toute transparence..."
                className={inputClass}
              />
            </Field>

            {/* Delivery Option Toggle */}
            <div className="p-4 rounded-[8px] bg-[#F2E9DC]/70 border border-[#DDCDB6] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconPackage className="w-5 h-5 text-[#1C3049]" />
                <div>
                  <h4 className="text-xs font-bold text-[#1C3049]">Livraison et encaissement à domicile (NovaSen COD)</h4>
                  <p className="text-[0.72rem] text-[#7A6A5C]">Permettre aux acheteurs de se faire livrer par nos coursiers et de payer à la réception.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowDelivery}
                onChange={(e) => setAllowDelivery(e.target.checked)}
                className="w-5 h-5 rounded text-[#1C3049] cursor-pointer"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-[#DDCDB6]">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <IconArrowLeft className="w-4 h-4" />
                <span>Retour aux photos</span>
              </Button>
              <Button variant="primary" onClick={() => setStep(3)}>
                <span>Continuer vers la finalisation</span>
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: OPTIONS & CONFIRMATION */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#DDCDB6] flex flex-col gap-6 shadow-xs animate-fade-in">
            <h3 className="font-bold text-lg font-heading text-[#573721] border-b border-[#DDCDB6] pb-2">
              Récapitulatif & Mise en avant
            </h3>

            {/* Recap Card */}
            <div className="bg-[#F2E9DC] p-5 rounded-[8px] border border-[#DDCDB6] flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Article :</span>
                <strong className="text-[#573721]">{title || 'Sans titre'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Prix :</span>
                <strong className="text-base font-bold tabular-nums text-[#1C3049]">
                  {formatCFA(Number(price) || 0)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Photos :</span>
                <strong className="text-[#573721]">{uploadedPhotos.length} photo(s) chargée(s)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A5C]">Zone de collecte :</span>
                <strong className="text-[#573721]">{ZONES.find((z) => z.id === zoneId)?.name}</strong>
              </div>
            </div>

            {/* Boost Listing Option */}
            <div className="bg-white p-5 rounded-[8px] border border-[#C9A882] flex items-start gap-4">
              <input
                type="checkbox"
                id="feat-check"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-[#7A5133] mt-0.5 cursor-pointer"
              />
              <label htmlFor="feat-check" className="cursor-pointer flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#573721] flex items-center gap-1.5">
                    <IconStar className="w-4 h-4 text-[#7A5133]" />
                    <span>Mettre en avant cette annonce (+1 000 CFA pour 7 jours)</span>
                  </span>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  Apparaît en tête des résultats de recherche avec le badge exclusif « En avant ».
                </p>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#DDCDB6] flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                <IconArrowLeft className="w-4 h-4" />
                <span>Modifier les détails</span>
              </Button>

              {isQuotaReached ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-red-600 font-semibold">Quota de 3 annonces atteint</span>
                  <Link href="/vendeur">
                    <Button variant="primary">
                      <span>Passer à la formule Boutique</span>
                      <IconArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button type="submit" variant="primary">
                  <span>Confirmer et publier l’annonce</span>
                  <IconCheck className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
