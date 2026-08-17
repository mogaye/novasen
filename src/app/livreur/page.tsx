'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { DRIVER_PLANS, DRIVER_REGISTRATION_FEE } from '@/lib/plans';
import { DriverPlanId } from '@/lib/types';
import { formatCFA } from '@/lib/format';
import { EarningsSimulator } from '@/components/EarningsSimulator';
import { FakePaymentModal } from '@/components/FakePaymentModal';
import { PlanCard } from '@/components/PlanCard';
import { Field, inputClass, selectClass } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import {
  IconCar,
  IconPackage,
  IconShieldCheck,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconTrendingUp,
} from '@/components/ui/Icons';

export default function DriverOnboardingPage() {
  const { driverPlan, setDriverPlan, updateDriverProfile, showSuccessToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Driver identity & branding state
  const [fullName, setFullName] = useState('Abdoulaye Diallo');
  const [fleetName, setFleetName] = useState('Diallo Express Dakar');
  const [phone, setPhone] = useState('+221 77 000 12 34');
  const [whatsapp, setWhatsapp] = useState('+221 77 000 12 34');
  const [email, setEmail] = useState('abdoulaye.diallo@novasen.sn');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80');
  
  // Security & KYC state
  const [cniNumber, setCniNumber] = useState('1 758 1991 04829');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('SN-DK-2018-84729');
  const [licenseCategory, setLicenseCategory] = useState<'A' | 'B' | 'C'>('A');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-10-15');
  const [cniFileUploaded, setCniFileUploaded] = useState(true);
  const [licenseFileUploaded, setLicenseFileUploaded] = useState(true);

  // Vehicle info state
  const [vehicleType, setVehicleType] = useState<'moto' | 'voiture' | 'camionnette'>('moto');
  const [vehicleMake, setVehicleMake] = useState('Yamaha');
  const [vehicleModel, setVehicleModel] = useState('Scooter TMax 530 & Top-case');
  const [vehicleYear, setVehicleYear] = useState('2021');
  const [licensePlate, setLicensePlate] = useState('DK-3490-AX');
  const [carteGriseNumber, setCarteGriseNumber] = useState('CG-2021-94827');
  const [insuranceCompany, setInsuranceCompany] = useState('AXA Assurances Sénégal');
  const [activityTypes, setActivityTypes] = useState<{ passengers: boolean; parcels: boolean }>({
    passengers: false,
    parcels: true,
  });

  // Photo upload helpers
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        showSuccessToast('Photo de profil mise à jour avec succès !');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result);
        showSuccessToast('Photo de couverture mise à jour !');
      }
    };
    reader.readAsDataURL(file);
  };

  // Selected Plan
  const [selectedPlanId, setSelectedPlanId] = useState<DriverPlanId>('journalier');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const selectedPlan = DRIVER_PLANS.find((p) => p.id === selectedPlanId) || DRIVER_PLANS[0];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTypes.passengers && !activityTypes.parcels) {
      alert('Veuillez sélectionner au moins un métier (Passagers ou Colis).');
      return;
    }
    setStep(3);
  };

  const handleValidation = () => {
    if (!agreeTerms) {
      alert('Veuillez accepter la charte de sécurité routière et de transport.');
      return;
    }
    setPaymentModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 sm:gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[#DDCDB6] text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
          Espace Livreurs & Coursiers Colis
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#1C3049] tracking-tight">
          Rejoignez le réseau de livreurs NovaSen
        </h1>
        <p className="text-sm text-[#7A6A5C]">
          Recevez directement les commandes de livraison de nos marchands et clients à Dakar et au Sénégal. 0% de commission : fixez librement vos tarifs et gardez 100% de vos gains.
        </p>
      </div>

      {/* 4 Steps indicator */}
      <div className="grid grid-cols-4 gap-2 bg-[#E8DBC8] p-1.5 rounded-[10px] border border-[#DDCDB6] text-xs font-bold uppercase tracking-wider text-center">
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 1 ? 'bg-[#1C3049] text-white shadow-sm' : 'text-[#1C3049]'}`}>
          1. Identité & Permis
        </div>
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 2 ? 'bg-[#1C3049] text-white shadow-sm' : 'text-[#1C3049]'}`}>
          2. Véhicule & Matériel
        </div>
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 3 ? 'bg-[#1C3049] text-white shadow-sm' : 'text-[#1C3049]'}`}>
          3. Forfait Livreur
        </div>
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 4 ? 'bg-[#1C3049] text-white shadow-sm' : 'text-[#1C3049]'}`}>
          4. Validation
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 1 : IDENTITÉ & PERMIS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 sm:p-10 flex flex-col gap-6 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 border-b border-[#DDCDB6] pb-3">
            <IconShieldCheck className="w-5 h-5 text-[#1C3049]" />
            <h3 className="font-bold text-xl font-heading text-[#1C3049]">
              1. Identité, Photos & Documents de Sécurité
            </h3>
          </div>

          {/* Photos: Profil & Couverture */}
          <div className="bg-[#F2E9DC]/70 p-5 rounded-[14px] border border-[#DDCDB6] flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C3049] flex items-center gap-2">
              <span>📸 Photos de vitrine (Profil & Couverture)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo de Profil / Logo */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#2A211A]">
                  Photo de profil ou Logo d'entreprise <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-[14px] object-cover border-2 border-white shadow-md bg-white"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-[8px] bg-[#1C3049] hover:bg-[#13223A] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                      <span>Importer une photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-[#7A6A5C]">
                      JPG, PNG ou WebP. Visage ou logo bien visible.
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo de Couverture */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#2A211A]">
                  Photo de couverture / Bannière <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  <div className="relative h-20 rounded-[12px] overflow-hidden border border-[#DDCDB6] bg-[#1C3049]">
                    <img
                      src={coverUrl}
                      alt="Couverture"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <label className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-all flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                      <span>Changer la bannière de couverture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6A5C]">
                    Visible sur votre vitrine publique chauffeur/coursier.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coordonnées & Enseigne */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom et prénom complet du chauffeur" required>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Abdoulaye Diallo"
                className={inputClass}
              />
            </Field>

            <Field label="Enseigne / Nom de Flotte (Optionnel)" helper="Ex: Diallo Express, Dakar VTC...">
              <input
                type="text"
                value={fleetName}
                onChange={(e) => setFleetName(e.target.value)}
                placeholder="Ex: Diallo Express Dakar"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Numéro de Téléphone Appel (+221)" required helper="Pour appels vocaux directs">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +221 77 890 12 34"
                className={inputClass}
              />
            </Field>

            <Field label="Numéro WhatsApp Professionnel" required helper="Pour contact rapide acheteur/vendeur">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: +221 77 890 12 34"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                  💬 Actif
                </span>
              </div>
            </Field>

            <Field label="Adresse Email Professionnelle" required helper="Reçus et relevés hebdomadaires">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: abdoulaye.diallo@novasen.sn"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Documents KYC & Sécurité */}
          <div className="flex flex-col gap-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C3049]">
              🛡️ Pièces administratives & Sécurité routière
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Numéro CNI ou Passeport CEDEAO" required>
                <input
                  type="text"
                  required
                  value={cniNumber}
                  onChange={(e) => setCniNumber(e.target.value)}
                  placeholder="Ex: 1 758 1991 04829"
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro du Permis de conduire" required>
                <input
                  type="text"
                  required
                  value={driverLicenseNumber}
                  onChange={(e) => setDriverLicenseNumber(e.target.value)}
                  placeholder="Ex: SN-DK-2018-84729"
                  className={inputClass}
                />
              </Field>

              <Field label="Catégorie du permis" required>
                <select
                  value={licenseCategory}
                  onChange={(e) => setLicenseCategory(e.target.value as 'A' | 'B' | 'C')}
                  className={selectClass}
                >
                  <option value="A">Catégorie A / A1 (Deux-roues & Scooters)</option>
                  <option value="B">Catégorie B (Voitures de tourisme & VTC)</option>
                  <option value="C">Catégorie C (Poids lourds & Camionnettes)</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Document Verification Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-[10px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C3049] text-[#C9A882] flex items-center justify-center font-bold">
                  🪪
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#1C3049]">Permis de conduire valide</h5>
                  <span className="text-[0.7rem] text-emerald-700 font-semibold flex items-center gap-1">
                    <IconCheck className="w-3 h-3" /> Document vérifié conforme
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1C3049] cursor-pointer hover:underline">Modifier</span>
            </div>

            <div className="p-4 rounded-[10px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C3049] text-[#C9A882] flex items-center justify-center font-bold">
                  📄
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#1C3049]">Carte Nationale d'Identité</h5>
                  <span className="text-[0.7rem] text-emerald-700 font-semibold flex items-center gap-1">
                    <IconCheck className="w-3 h-3" /> Document vérifié conforme
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1C3049] cursor-pointer hover:underline">Modifier</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#DDCDB6]">
            <Button type="submit" variant="primary" className="min-w-[200px]">
              <span>Étape 2 : Véhicule & Métier</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 2 : VÉHICULE & MÉTIER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 sm:p-10 flex flex-col gap-6 shadow-xs animate-fade-in">
          <h3 className="font-bold text-xl font-heading text-[#1C3049] border-b border-[#DDCDB6] pb-3">
            Informations sur votre véhicule et vos missions
          </h3>

          {/* Vehicle Type Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">Type de véhicule</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setVehicleType('moto')}
                className={`p-4 rounded-[10px] border cursor-pointer flex flex-col gap-2 transition-all ${
                  vehicleType === 'moto'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏍️</span>
                  {vehicleType === 'moto' && <IconCheck className="w-4 h-4 text-[#1C3049]" />}
                </div>
                <h4 className="font-bold text-sm text-[#1C3049]">Scooter / Moto</h4>
                <p className="text-xs text-[#7A6A5C]">Idéal pour livraisons express et courses passager</p>
              </div>

              <div
                onClick={() => setVehicleType('voiture')}
                className={`p-4 rounded-[10px] border cursor-pointer flex flex-col gap-2 transition-all ${
                  vehicleType === 'voiture'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🚗</span>
                  {vehicleType === 'voiture' && <IconCheck className="w-4 h-4 text-[#1C3049]" />}
                </div>
                <h4 className="font-bold text-sm text-[#1C3049]">Berline VTC / SUV</h4>
                <p className="text-xs text-[#7A6A5C]">Transport de passagers et colis volumineux</p>
              </div>

              <div
                onClick={() => setVehicleType('camionnette')}
                className={`p-4 rounded-[10px] border cursor-pointer flex flex-col gap-2 transition-all ${
                  vehicleType === 'camionnette'
                    ? 'border-[#1C3049] bg-[#E8DBC8]/50 ring-1 ring-[#1C3049]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🚐</span>
                  {vehicleType === 'camionnette' && <IconCheck className="w-4 h-4 text-[#1C3049]" />}
                </div>
                <h4 className="font-bold text-sm text-[#1C3049]">Camionnette / Fret</h4>
                <p className="text-xs text-[#7A6A5C]">Déménagements et livraisons marchandes lourdes</p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Marque & Modèle" required>
              <input
                type="text"
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex: Peugeot 301 / Honda Dio"
                className={inputClass}
              />
            </Field>

            <Field label="Immatriculation (Plaque)" required>
              <input
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Ex: DK-3490-AX"
                className={inputClass}
              />
            </Field>

            <Field label="Numéro de Carte Grise" required>
              <input
                type="text"
                required
                value={carteGriseNumber}
                onChange={(e) => setCarteGriseNumber(e.target.value)}
                placeholder="Ex: CG-2019-94827"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Missions Allowed */}
          <div className="flex flex-col gap-2 border-t border-[#DDCDB6] pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C3049]">
              Types de colis & marchandises pris en charge
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3 rounded-[8px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activityTypes.parcels}
                  onChange={(e) => setActivityTypes({ ...activityTypes, parcels: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1C3049] cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-[#1C3049] block">Plis, Colis Express & Marchandises</span>
                  <span className="text-xs text-[#7A6A5C]">Acheminer les commandes marchandes et encaisser à la livraison</span>
                </div>
              </label>

              <div className="p-3 rounded-[8px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <span className="text-sm font-bold text-[#1C3049] block">Paiements en direct</span>
                  <span className="text-xs text-[#7A6A5C]">Vous encaissez directement auprès de vos clients sans commission</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#DDCDB6]">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <IconArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
            <Button type="submit" variant="primary">
              <span>Étape 3 : Forfait Livreur</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 3 : FORMULE LIVREUR & FORFAITS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C3049]">
              Choisissez votre forfait livreur
            </h2>
            <p className="text-sm text-[#7A6A5C]">
              Pass Journée (1 500 F/j), Abonnement Mensuel (35 000 F/mois) ou Annuel (400 000 F/an). 0% de commission sur l'intégralité de vos courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DRIVER_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`cursor-pointer transition-all ${
                  selectedPlanId === plan.id ? 'ring-2 ring-[#1C3049] rounded-[10px] scale-[1.01]' : ''
                }`}
              >
                <PlanCard
                  type="driver"
                  plan={plan}
                  isCurrent={driverPlan === plan.id}
                  onSelect={() => setSelectedPlanId(plan.id)}
                />
              </div>
            ))}
          </div>

          {/* Interactive Simulator */}
          <div className="bg-[#13223A] text-white p-6 sm:p-8 rounded-[16px] border border-[#1C3049] shadow-md">
            <h3 className="text-lg font-bold font-heading text-[#C9A882] mb-4 flex items-center gap-2">
              <IconTrendingUp className="w-5 h-5" />
              <span>Simulateur de gains livreur indépendant</span>
            </h3>
            <EarningsSimulator />
          </div>

          {/* Terms and Registration Fee */}
          <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="driver-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#1C3049] mt-0.5 cursor-pointer"
              />
              <label htmlFor="driver-terms" className="text-xs text-[#1C3049] cursor-pointer leading-relaxed">
                Je certifie posséder un véhicule en état de marche avec carte grise et assurance valides, ainsi qu'un permis de conduire sénégalais en cours de validité. J'accepte la charte des livreurs partenaires NovaSen.
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DDCDB6] flex-wrap gap-3">
              <div className="text-xs text-[#7A6A5C]">
                Forfait sélectionné :{' '}
                <strong className="text-sm font-bold tabular-nums text-[#1C3049]">
                  {selectedPlan.name} ({formatCFA(selectedPlan.price)})
                </strong>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  <IconArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </Button>
                <Button variant="primary" onClick={handleValidation}>
                  <span>Activer mon forfait ({formatCFA(selectedPlan.price)})</span>
                  <IconArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 4 : CONFIRMATION & TABLEAU DE BORD LIVREUR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-md max-w-2xl mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <IconCheck className="w-8 h-8 text-[#C9A882]" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
              Dossier Livreur Validé
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C3049]">
              Bienvenue dans le réseau, {fullName} !
            </h2>
            <p className="text-sm text-[#7A6A5C]">
              Votre véhicule <strong>{vehicleModel} ({licensePlate})</strong> est activé sous la formule <strong>{selectedPlan.name}</strong>. Vous pouvez dès à présent recevoir des commandes et livraisons de colis à Dakar.
            </p>
          </div>

          <div className="w-full bg-[#F2E9DC] p-4 rounded-[10px] border border-[#DDCDB6] text-left flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Livreur :</span>
              <strong className="text-[#1C3049]">{fullName} ({phone})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Véhicule :</span>
              <strong className="text-[#1C3049]">{vehicleModel} • {licensePlate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Activité :</span>
              <strong className="text-[#1C3049]">
                Livraison Colis & Fret Express
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
            <Link href="/chauffeur/drv-current-user" className="flex-1">
              <Button variant="primary" className="w-full">
                <span>Voir ma vitrine publique livreur</span>
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/compte" className="flex-1">
              <Button variant="secondary" className="w-full">
                <span>Gérer mon profil & documents</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Payment Modal for 1,500 CFA registration fee */}
      {paymentModalOpen && (
        <FakePaymentModal
          onClose={() => setPaymentModalOpen(false)}
          planId={selectedPlanId}
          planType="driver"
          onSuccess={() => {
            setDriverPlan(selectedPlanId);
            updateDriverProfile({
              fullName,
              fleetName,
              phone,
              whatsapp,
              email,
              avatarUrl,
              coverUrl,
              cniNumber,
              driverLicenseNumber,
              vehicleType,
              vehicleModel,
              licensePlate,
              carteGriseNumber,
              insuranceCompany,
              activityTypes,
              isVerified: true,
            });
            setPaymentModalOpen(false);
            setStep(4);
            showSuccessToast('Dossier validé ! Votre vitrine chauffeur/coursier est en ligne.');
          }}
          title="Frais d'enregistrement Chauffeur"
          amount={DRIVER_REGISTRATION_FEE}
          description={`Vérification et validation de votre dossier (${selectedPlan.name}).`}
        />
      )}
    </div>
  );
}
