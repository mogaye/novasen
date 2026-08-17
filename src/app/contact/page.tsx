'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import {
  IconPhone,
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconCheck,
  IconArrowRight,
  IconPackage,
  IconCar,
} from '@/components/ui/Icons';
import { LogoWave, LogoOrangeMoney } from '@/components/PaymentLogos';

export default function ContactPage() {
  const { showSuccessToast } = useApp();
  const [profileType, setProfileType] = useState<'buyer' | 'seller' | 'driver' | 'partner'>('buyer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('livraison');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  const PROFILE_LABELS: Record<string, string> = {
    buyer: '🛍️ Acheteur',
    seller: '🏪 Vendeur',
    driver: '🛵 Chauffeur / Livreur',
    partner: '🤝 Partenaire',
  };

  const SUBJECT_LABELS: Record<string, string> = {
    livraison: '📦 Suivi ou problème sur une livraison en cours',
    paiement: '💳 Question sur un paiement Wave / OM / Carte',
    boutique: '🏪 Certification ou formule Boutique Vendeur',
    chauffeur: '🛵 Inscription ou forfait Chauffeur / Livreur',
    autre: '❓ Autre renseignement',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedWhatsAppMsg = [
      '🌟 *NOUVEAU MESSAGE DE CONTACT - NOVASEN* 🌟',
      '━━━━━━━━━━━━━━━━━━━━',
      `👤 *Nom complet* : ${fullName}`,
      `📞 *Numéro de contact* : ${phone}`,
      `🏷️ *Statut / Profil* : ${PROFILE_LABELS[profileType] || profileType}`,
      `🎯 *Objet de la demande* : ${SUBJECT_LABELS[subject] || subject}`,
      '━━━━━━━━━━━━━━━━━━━━',
      '💬 *Détail du message* :',
      `"${message}"`,
      '━━━━━━━━━━━━━━━━━━━━',
      `⏰ *Date d'envoi* : ${dateStr}`,
      '📍 *Plateforme* : NovaSen • Marché & Logistique Dakar',
    ].join('\n');

    const targetUrl = `https://wa.me/221705908725?text=${encodeURIComponent(formattedWhatsAppMsg)}`;
    setLastWhatsAppUrl(targetUrl);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      showSuccessToast('Transmission vers votre WhatsApp en cours...');
      // Ouvrir directement la discussion WhatsApp avec le message structuré
      window.open(targetUrl, '_blank');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col gap-12">
      {/* 1. Header Banner */}
      <div className="text-center flex flex-col gap-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DBC8] border border-[#DDCDB6] text-xs font-bold uppercase tracking-widest text-[#7A5133] mx-auto">
          <span>🎧 Support & Assistance Opérateurs 24/7</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#573721] tracking-tight">
          Liaison Directe avec nos Opérateurs à Dakar
        </h1>
        <p className="text-sm sm:text-base text-[#7A6A5C] leading-relaxed">
          Une question sur une commande, un colis en cours, votre boutique ou vos courses ? Nos équipes vous répondent instantanément par WhatsApp, téléphone ou message.
        </p>
      </div>

      {/* 2. Direct Channels Bento (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Channel 1: WhatsApp Support */}
        <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group">
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              💬
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              <span>● En ligne maintenant</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-[#2A211A]">
              WhatsApp Direct Opérateur
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6A5C] leading-relaxed">
              Discutez en direct avec notre cellule d’assistance commerciale et support NovaSen. Idéal pour un renseignement, une question boutique ou une livraison.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-[#DDCDB6]/60">
            <span className="text-xs font-semibold text-[#573721]">Temps de réponse moyen : <strong>&lt; 2 minutes</strong></span>
            <a
              href="https://wa.me/221705908725?text=Bonjour%20NovaSen,%20j'aimerais%20avoir%20une%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>Contacter sur WhatsApp</span>
              <IconArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Channel 2: Hotline Téléphonique */}
        <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md hover:border-[#1C3049] transition-all group">
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1C3049] text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              📞
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1C3049]">
              <span>Assistance Téléphonique 7j/7</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1C3049]">
              Ligne d'Appel Directe
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6A5C] leading-relaxed">
              Pour joindre immédiatement un conseiller NovaSen pour une livraison en cours, un chauffeur ou une question d'encaissement.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-[#DDCDB6]/60">
            <span className="text-xs font-semibold text-[#573721]">Disponible 7j/7 : <strong>06h00 – 23h00</strong></span>
            <a
              href="tel:+221789139036"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>Appeler le support</span>
            </a>
          </div>
        </div>

        {/* Channel 3: Centre d’Opérations Dakar */}
        <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md hover:border-[#7A5133] transition-all group">
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7A5133] text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              🏢
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7A5133]">
              <span>Bureaux & Accueil Vendeurs</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-[#573721]">
              Hub Opérationnel Sénégal
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6A5C] leading-relaxed">
              Dakar, Thiès & toutes régions. Accueil pour certification de profil, remise de stickers de flotte et accompagnement vendeurs.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-[#DDCDB6]/60">
            <span className="text-xs font-semibold text-[#573721]">Siège : <strong>Dakar • Sénégal</strong></span>
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] font-bold text-xs sm:text-sm border border-[#DDCDB6] transition-all"
            >
              <span>Consulter les formules Pro</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Formulaire de contact direct pour opérateurs */}
      <div className="bg-white rounded-[24px] border border-[#DDCDB6] p-6 sm:p-10 shadow-md">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Formulaire de Réclamation & Demande
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
              Envoyer un message à la cellule d'assistance
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6A5C]">
              Remplissez les informations ci-dessous, un opérateur NovaSen prendra en charge votre dossier en moins de 15 minutes.
            </p>
          </div>

          {isSent ? (
            <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-2xl text-center flex flex-col items-center gap-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-md">
                ✓
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-emerald-900 font-heading">
                  Message préparé et transmis !
                </h3>
                <p className="text-sm text-emerald-800 max-w-md">
                  Merci <strong>{fullName || 'cher utilisateur'}</strong>. Toutes vos informations (Profil {PROFILE_LABELS[profileType]}, Téléphone {phone}, Objet et Message) ont été formatées et transmises sur WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Ouvrir la discussion WhatsApp</span>
                    <IconArrowRight className="w-4 h-4" />
                  </a>
                )}
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                >
                  Envoyer un autre message
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Type de profil */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#573721]">
                  Vous êtes :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'buyer', label: '🛍️ Acheteur' },
                    { id: 'seller', label: '🏪 Vendeur' },
                    { id: 'driver', label: '🛵 Chauffeur' },
                    { id: 'partner', label: '🤝 Partenaire' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProfileType(tab.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        profileType === tab.id
                          ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#573721] border-[#DDCDB6] hover:bg-[#E8DBC8]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#573721]">
                    Votre Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Cheikh Anta Diop"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#573721]">
                    Numéro de Téléphone (+221)
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="77 000 12 34"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
                  />
                </div>
              </div>

              {/* Objet */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#573721]">
                  Objet de votre demande
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
                >
                  <option value="livraison">📦 Suivi ou problème sur une livraison en cours</option>
                  <option value="paiement">💳 Question sur un paiement Wave / OM / Carte</option>
                  <option value="boutique">🏪 Certification ou formule Boutique Vendeur</option>
                  <option value="chauffeur">🛵 Inscription ou forfait Chauffeur / Livreur</option>
                  <option value="autre">❓ Autre renseignement</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#573721]">
                  Détail de votre message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre situation (numéro d'annonce, quartier de Dakar, référence de commande...)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="mt-2 font-bold"
              >
                {isSubmitting ? 'Transmission en cours...' : 'Envoyer mon message aux opérateurs'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#7A6A5C] text-center pt-2">
                <IconShieldCheck className="w-4 h-4 text-[#7A5133]" />
                <span>Cellule d’astreinte basée à Dakar • Réponse 7j/7</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
