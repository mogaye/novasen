'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SELLER_PLANS } from '@/lib/plans';
import { SellerPlanId } from '@/lib/types';
import { ZONES } from '@/lib/zones';
import { formatCFA } from '@/lib/format';
import { PlanCard } from '@/components/PlanCard';
import { FakePaymentModal } from '@/components/FakePaymentModal';
import { Field, inputClass, selectClass } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import {
  IconShieldCheck,
  IconStar,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconPackage,
  IconMapPin,
  IconInfo,
} from '@/components/ui/Icons';

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { userPlan, setUserPlan, setIsSellerRegistered, setSellerShopName, updateSellerProfile, showSuccessToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Shop info & branding state
  const [sellerType, setSellerType] = useState<'particulier' | 'professionnel'>('professionnel');
  const [shopName, setShopName] = useState('Dakar Électro Boutique');
  const [ownerName, setOwnerName] = useState('Aminata Fall');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80');
  const [zoneId, setZoneId] = useState('medina');
  const [address, setAddress] = useState('Rue 11 x Boulevard Général de Gaulle');
  const [phone, setPhone] = useState('+221 77 000 28 19');
  const [whatsapp, setWhatsapp] = useState('+221 77 000 28 19');
  const [email, setEmail] = useState('contact@dakarelectro.sn');
  const [payoutMethod, setPayoutMethod] = useState<'wave' | 'orange_money'>('wave');
  const [idNumber, setIdNumber] = useState('1 758 1994 02938');
  const [ninea, setNinea] = useState('009482739 2V3');
  const [cniUploaded, setCniUploaded] = useState(true);
  const [rccmUploaded, setRccmUploaded] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Upload handlers
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        showSuccessToast('Logo / Photo de boutique importé !');
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
        showSuccessToast('Bannière de couverture boutique importée !');
      }
    };
    reader.readAsDataURL(file);
  };

  // Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<SellerPlanId>('boutique');

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const selectedPlan = SELLER_PLANS.find((p) => p.id === selectedPlanId) || SELLER_PLANS[1];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Veuillez accepter les conditions d’utilisation de NovaSen.');
      return;
    }
    setStep(2);
  };

  const handleCompleteRegistration = () => {
    if (selectedPlan.price > 0) {
      setPaymentModalOpen(true);
    } else {
      setUserPlan('particulier');
      setIsSellerRegistered(true);
      setSellerShopName(shopName || 'Boutique Particulier');
      setStep(3);
      showSuccessToast('Votre compte vendeur Particulier est validé !');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 sm:gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[#DDCDB6] text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
          Espace Vendeurs & Boutiques
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#573721] tracking-tight">
          Ouvrez votre Boutique vérifiée NovaSen
        </h1>
        <p className="text-sm text-[#7A6A5C]">
          Augmentez vos ventes grâce au badge vérifié, à la visibilité prioritaire et à l'encaissement automatique par coursier.
        </p>
      </div>

      {/* 3 Steps indicator */}
      <div className="grid grid-cols-3 gap-2 bg-[#E8DBC8] p-1.5 rounded-[10px] border border-[#DDCDB6] text-xs font-bold uppercase tracking-wider text-center">
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 1 ? 'bg-[#7A5133] text-white shadow-sm' : 'text-[#573721]'}`}>
          1. Profil & Légalité
        </div>
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 2 ? 'bg-[#7A5133] text-white shadow-sm' : 'text-[#573721]'}`}>
          2. Formule Vendeur
        </div>
        <div className={`py-2.5 rounded-[8px] transition-colors ${step === 3 ? 'bg-[#7A5133] text-white shadow-sm' : 'text-[#573721]'}`}>
          3. Confirmation
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 1 : PROFIL & LÉGALITÉ */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="bg-white rounded-[16px] border border-[#DDCDB6] p-6 sm:p-10 flex flex-col gap-8 shadow-xs animate-fade-in">
          {/* Seller Type Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">Type d'activité commerciale</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSellerType('professionnel')}
                className={`p-4 rounded-[10px] border cursor-pointer flex items-center justify-between transition-all ${
                  sellerType === 'professionnel'
                    ? 'border-[#7A5133] bg-[#E8DBC8]/40 ring-1 ring-[#7A5133]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏬</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#573721]">Boutique / Entreprise</h4>
                    <p className="text-xs text-[#7A6A5C]">Magasin physique, e-commerce ou marque déclarée</p>
                  </div>
                </div>
                {sellerType === 'professionnel' && <IconCheck className="w-5 h-5 text-[#7A5133]" />}
              </div>

              <div
                onClick={() => setSellerType('particulier')}
                className={`p-4 rounded-[10px] border cursor-pointer flex items-center justify-between transition-all ${
                  sellerType === 'particulier'
                    ? 'border-[#7A5133] bg-[#E8DBC8]/40 ring-1 ring-[#7A5133]'
                    : 'border-[#DDCDB6] hover:bg-[#F2E9DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#573721]">Vendeur Particulier</h4>
                    <p className="text-xs text-[#7A6A5C]">Vente occasionnelle d'objets personnels</p>
                  </div>
                </div>
                {sellerType === 'particulier' && <IconCheck className="w-5 h-5 text-[#7A5133]" />}
              </div>
            </div>
          </div>

          {/* Photos: Logo & Couverture */}
          <div className="bg-[#F2E9DC]/70 p-5 rounded-[14px] border border-[#DDCDB6] flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5133] flex items-center gap-2">
              <span>📸 Photos de vitrine boutique (Logo & Bannière de couverture)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo / Avatar Boutique */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#2A211A]">
                  Logo ou Photo de vitrine <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Logo Boutique"
                      className="w-20 h-20 rounded-[14px] object-cover border-2 border-white shadow-md bg-white"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-[8px] bg-[#7A5133] hover:bg-[#573721] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                      <span>Importer un logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-[#7A6A5C]">
                      PNG, JPG ou WebP. Image carrée recommandée.
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo de Couverture */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#2A211A]">
                  Bannière de couverture de la boutique <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  <div className="relative h-20 rounded-[12px] overflow-hidden border border-[#DDCDB6] bg-[#7A5133]">
                    <img
                      src={coverUrl}
                      alt="Couverture"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <label className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-all flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                      <span>Changer la bannière</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6A5C]">
                    Visible en haut de votre vitrine publique vendeur.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="flex flex-col gap-4 border-t border-[#DDCDB6]/70 pt-6">
            <h3 className="font-bold text-lg font-heading text-[#573721]">
              Informations sur votre commerce
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom de votre boutique ou marque" required>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Ex: Dakar Électro Boutique"
                  className={inputClass}
                />
              </Field>

              <Field label="Nom complet du gérant / propriétaire" required>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ex: Aminata Fall"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Numéro de Téléphone Appel (+221)" required>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +221 77 645 28 19"
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro WhatsApp Professionnel" required helper="Pour discussions acheteurs directes">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: +221 77 645 28 19"
                    className={inputClass}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                    💬 Actif
                  </span>
                </div>
              </Field>

              <Field label="Adresse Email de contact" required>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: contact@dakarelectro.sn"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Quartier principal à Dakar" required>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={selectClass}
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.description || 'Zone Dakar'})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Adresse exacte du point de collecte" required helper="Le coursier s'y rendra pour récupérer les colis">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rue 11 x Boulevard Général de Gaulle"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Payout Details */}
          <div className="flex flex-col gap-4 border-t border-[#DDCDB6]/70 pt-6">
            <h3 className="font-bold text-lg font-heading text-[#573721]">
              Numéro de versement des ventes (Paiement à la livraison)
            </h3>
            <p className="text-xs text-[#7A6A5C] -mt-2">
              Le livreur encaisse l'argent à l'arrivée chez le client et le reverse immédiatement sur ce compte.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Mode de versement automatique" required>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('wave')}
                    className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold border transition-all ${
                      payoutMethod === 'wave'
                        ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-sm'
                        : 'bg-[#F2E9DC] text-[#7A6A5C] border-[#DDCDB6]'
                    }`}
                  >
                    🌊 Wave Sénégal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('orange_money')}
                    className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold border transition-all ${
                      payoutMethod === 'orange_money'
                        ? 'bg-[#7A5133] text-white border-[#7A5133] shadow-sm'
                        : 'bg-[#F2E9DC] text-[#7A6A5C] border-[#DDCDB6]'
                    }`}
                  >
                    🟠 Orange Money
                  </button>
                </div>
              </Field>

              <Field label="Numéro de téléphone (+221)" required helper="Doit correspondre au compte Wave ou OM">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 77 645 28 19"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Legal Compliance & ID Verification */}
          <div className="flex flex-col gap-4 border-t border-[#DDCDB6]/70 pt-6">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="w-5 h-5 text-[#7A5133]" />
              <h3 className="font-bold text-lg font-heading text-[#573721]">
                Vérification d'identité & Justificatifs légaux
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Numéro CNI ou Passeport (CEDEAO)" required>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Ex: 1 758 1994 02938"
                  className={inputClass}
                />
              </Field>

              {sellerType === 'professionnel' && (
                <Field label="Numéro NINEA ou Registre de Commerce (RCCM)" helper="Optionnel pour particuliers">
                  <input
                    type="text"
                    value={ninea}
                    onChange={(e) => setNinea(e.target.value)}
                    placeholder="Ex: 009482739 2V3"
                    className={inputClass}
                  />
                </Field>
              )}
            </div>

            {/* Document Upload Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-[10px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center font-bold">
                    📄
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#573721]">Pièce d'identité (Recto / Verso)</h5>
                    <span className="text-[0.7rem] text-emerald-700 font-semibold flex items-center gap-1">
                      <IconCheck className="w-3 h-3" /> Fichier conforme téléchargé
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#7A5133] cursor-pointer hover:underline">Modifier</span>
              </div>

              <div className="p-4 rounded-[10px] border border-[#DDCDB6] bg-[#F2E9DC]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center font-bold">
                    🏬
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#573721]">Photo de la boutique / Enseigne</h5>
                    <span className="text-[0.7rem] text-emerald-700 font-semibold flex items-center gap-1">
                      <IconCheck className="w-3 h-3" /> Photo conforme
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#7A5133] cursor-pointer hover:underline">Modifier</span>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 p-4 rounded-[8px] bg-[#E8DBC8]/50 border border-[#DDCDB6]">
            <input
              type="checkbox"
              id="seller-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded text-[#7A5133] mt-0.5 cursor-pointer"
            />
            <label htmlFor="seller-terms" className="text-xs text-[#573721] cursor-pointer leading-relaxed">
              Je certifie l’authenticité des informations fournies et j’accepte la charte des marchands NovaSen, notamment l'obligation de livrer des produits conformes aux annonces publiées.
            </label>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-4 border-t border-[#DDCDB6]">
            <Button type="submit" variant="primary" className="min-w-[200px]">
              <span>Continuer vers les formules</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 2 : CHOIX DE LA FORMULE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
              Choisissez votre formule de visibilité
            </h2>
            <p className="text-sm text-[#7A6A5C]">
              Les 3 premières annonces sont gratuites pour tous les vendeurs. Passez à la formule Boutique pour débloquer le badge certifié et multiplier vos contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SELLER_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`cursor-pointer transition-all ${
                  selectedPlanId === plan.id ? 'ring-2 ring-[#7A5133] rounded-[10px] scale-[1.02]' : ''
                }`}
              >
                <PlanCard
                  type="seller"
                  plan={plan}
                  isCurrent={userPlan === plan.id}
                  onSelect={() => setSelectedPlanId(plan.id)}
                />
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between p-6 bg-white rounded-[10px] border border-[#DDCDB6]">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <IconArrowLeft className="w-4 h-4" />
              <span>Modifier le profil</span>
            </Button>

            <Button variant="primary" onClick={handleCompleteRegistration}>
              <span>{selectedPlan.price === 0 ? 'Activer mon compte gratuit' : `Valider la formule (${formatCFA(selectedPlan.price)}/mois)`}</span>
              <IconArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ÉTAPE 3 : CONFIRMATION & SUCCÈS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-[16px] border border-[#DDCDB6] p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-md max-w-2xl mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <IconCheck className="w-8 h-8 text-[#E8DBC8]" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Boutique Activée avec Succès
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
              Félicitations, {shopName} !
            </h2>
            <p className="text-sm text-[#7A6A5C]">
              Votre compte vendeur sous la formule <strong>{selectedPlan.name}</strong> est opérationnel. Vos coordonnées de collecte à {ZONES.find(z => z.id === zoneId)?.name || 'Dakar'} sont enregistrées pour les coursiers.
            </p>
          </div>

          <div className="w-full bg-[#F2E9DC] p-4 rounded-[10px] border border-[#DDCDB6] text-left flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Gérant :</span>
              <strong className="text-[#573721]">{ownerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Versement des ventes :</span>
              <strong className="text-[#1C3049]">{payoutMethod === 'wave' ? 'Wave' : 'Orange Money'} ({phone})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6A5C]">Badge :</span>
              <strong className="text-[#7A5133]">Vendeur Vérifié NovaSen 🛡️</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
            <Link href={`/boutique/${encodeURIComponent(shopName)}`} className="flex-1">
              <Button variant="primary" className="w-full">
                <span>Voir ma vitrine publique vendeur</span>
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/publier" className="flex-1">
              <Button variant="secondary" className="w-full">
                <span>Déposer une annonce</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <FakePaymentModal
          onClose={() => setPaymentModalOpen(false)}
          planId={selectedPlanId}
          planType="seller"
          onSuccess={() => {
            setUserPlan(selectedPlanId);
            setIsSellerRegistered(true);
            setSellerShopName(shopName || 'Boutique NovaSen');
            updateSellerProfile({
              name: ownerName,
              shopName: shopName || 'Boutique NovaSen',
              avatarUrl,
              coverUrl,
              phone,
              whatsapp,
              email,
              address,
              zoneId: zoneId as any,
              payoutMethod: payoutMethod as any,
              payoutNumber: phone,
              cniNumber: idNumber,
              ninea,
              isVerified: true,
            });
            setPaymentModalOpen(false);
            setStep(3);
            showSuccessToast(`Formule ${selectedPlan.name} activée avec succès !`);
          }}
          title={`Abonnement Vendeur : ${selectedPlan.name}`}
          amount={selectedPlan.price}
          description={`Activation de la formule ${selectedPlan.name} pour 30 jours.`}
        />
      )}
    </div>
  );
}
