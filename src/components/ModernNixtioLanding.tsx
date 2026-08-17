'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  IconArrowRight,
  IconCheck,
  IconShieldCheck,
  IconPackage,
  IconCar,
  IconBike,
  IconTruck,
  IconStar,
  IconTrendingUp,
  IconMapPin,
  IconClock,
  IconSmartphone,
  IconUser,
  IconSearch,
} from '@/components/ui/Icons';

export function ModernNixtioLanding() {
  // Active Persona Tab (Acheteur, Vendeur, Transporteur)
  const [activePersona, setActivePersona] = useState<'buyer' | 'seller' | 'driver'>('buyer');

  // Interactive Live Delivery Simulator
  const [simKm, setSimKm] = useState<number>(18);
  const [selectedVehicle, setSelectedVehicle] = useState<'moto' | 'taxi' | 'camion'>('moto');

  // 3D Tilt state for hero console
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle 3D rotation angles (-6deg to +6deg)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ rotateX, rotateY });

    // Update CSS custom property for spotlight effect
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Dynamic live counter
  const [membersCount, setMembersCount] = useState(24850);
  useEffect(() => {
    const timer = setInterval(() => {
      setMembersCount((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const calculateEstimate = () => {
    const base = { moto: 1000, taxi: 2000, camion: 4500 };
    const perKm = { moto: 90, taxi: 160, camion: 320 };
    return (base[selectedVehicle] + simKm * perKm[selectedVehicle]).toLocaleString('fr-FR');
  };

  return (
    <div className="relative overflow-hidden w-full selection:bg-[#7A5133] selection:text-white bg-[#F2E9DC]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 0. MULTI-LAYER ORGANIC MORPHING AURORA (Nixtio Signature)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1250px] h-[700px] bg-gradient-to-tr from-[#E8DBC8] via-[#C9A882]/45 to-[#1C3049]/25 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob-drift-1" />
      <div className="absolute top-[800px] -left-60 w-[750px] h-[750px] bg-gradient-to-br from-[#9B4A32]/25 via-[#E8A856]/20 to-[#7A5133]/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-[1800px] -right-60 w-[850px] h-[850px] bg-gradient-to-tl from-[#1C3049]/35 via-[#385D8A]/20 to-[#C9A882]/30 rounded-full blur-[140px] pointer-events-none -z-10 animate-blob-drift-2" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION: L'ACCUEIL CHALEUREUX & TILT 3D INTERACTIF    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Floating Welcome Pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-pill border border-[#DDCDB6] mb-8 animate-float-gentle cursor-default shadow-xs hover:scale-105 transition-transform">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-[#573721] tracking-wide uppercase">
            ✦ Bienvenue sur NovaSen • Plateforme Nationale
          </span>
          <span className="text-xs text-[#7A6A5C] hidden sm:inline">
            • {membersCount.toLocaleString('fr-FR')} membres connectés
          </span>
        </div>

        {/* Grand Titre Émotionnel */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-[#2A211A] max-w-5xl leading-[1.08] mb-8">
          Le Sénégal a enfin sa plateforme de{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A5133] via-[#9B4A32] to-[#1C3049]">
              confiance absolue.
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#C9A882] opacity-75"
              viewBox="0 0 250 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9C60 3 190 2 247 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Sous-titre Invitant et Chaleureux */}
        <p className="text-base sm:text-xl text-[#7A6A5C] max-w-3xl font-normal leading-relaxed mb-12">
          NovaSen réunit la vitalité du commerce local et la puissance d’un réseau de transport express à la demande. Achetez, vendez et expédiez vos colis partout au Sénégal avec le <strong className="text-[#2A211A] font-semibold">paiement sécurisé à la livraison</strong>.
        </p>

        {/* CTA Principal : Invitation irrésistible à entrer & se connecter */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-16">
          <Link
            href="/accueil"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#573721] text-white font-extrabold text-base hover:bg-[#3D2616] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#573721]/30 flex items-center justify-center gap-3 group border border-white/20"
          >
            <span>✦ Entrer sur NovaSen</span>
            <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#C9A882]" />
          </Link>
          <Link
            href="/connexion"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#7A5133] text-white font-bold text-base hover:bg-[#573721] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#7A5133]/20 flex items-center justify-center gap-2"
          >
            <span>Créer mon compte</span>
          </Link>
          <Link
            href="/connexion"
            className="w-full sm:w-auto px-7 py-4 rounded-full glass-pill border border-[#DDCDB6] text-[#1C3049] font-bold text-base hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <IconUser className="w-5 h-5 text-[#1C3049]" />
            <span>Se connecter</span>
          </Link>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* MOCKUP APPLICATIF 3D TILT AVEC REFLETS & BADGES EN LÉVITATION */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-5xl perspective-container">
          {/* Badge Flottant 1: Sérénité Paiement */}
          <div className="absolute -top-8 -left-4 sm:-left-8 z-30 hidden md:flex items-center gap-3.5 px-5 py-3.5 rounded-2xl glass-nixtio shadow-2xl animate-float-gentle border border-white">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <IconShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#2A211A]">Zéro arnaque</div>
              <div className="text-xs text-[#7A6A5C]">Payez après inspection du colis</div>
            </div>
          </div>

          {/* Badge Flottant 2: Réseau National */}
          <div className="absolute -top-8 -right-4 sm:-right-8 z-30 hidden md:flex items-center gap-3.5 px-5 py-3.5 rounded-2xl glass-nixtio shadow-2xl animate-float-reverse border border-white">
            <div className="w-11 h-11 rounded-xl bg-[#1C3049]/15 text-[#1C3049] flex items-center justify-center font-bold shadow-xs">
              <IconMapPin className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#1C3049]">14 Régions connectées</div>
              <div className="text-xs text-[#7A6A5C]">Dakar, Thiès, Touba, Saint-Louis...</div>
            </div>
          </div>

          {/* Carte Vitrine Interactive avec 3D Tilt au mouvement de la souris */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="glass-nixtio rounded-[36px] sm:rounded-[44px] p-6 sm:p-12 border border-white/90 shadow-2xl relative overflow-hidden spotlight-card preserve-3d"
          >
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
                Une seule plateforme, 3 expériences sur-mesure
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#2A211A] mt-2">
                Quel est votre projet aujourd'hui ?
              </h3>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1.5 rounded-full bg-[#E8DBC8]/60 border border-[#DDCDB6] backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActivePersona('buyer')}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activePersona === 'buyer'
                      ? 'bg-[#7A5133] text-white shadow-md scale-105'
                      : 'text-[#7A6A5C] hover:text-[#2A211A]'
                  }`}
                >
                  <span>🛍️ Je suis Acheteur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePersona('seller')}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activePersona === 'seller'
                      ? 'bg-[#9B4A32] text-white shadow-md scale-105'
                      : 'text-[#7A6A5C] hover:text-[#2A211A]'
                  }`}
                >
                  <span>🏪 Je suis Vendeur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePersona('driver')}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activePersona === 'driver'
                      ? 'bg-[#1C3049] text-white shadow-md scale-105'
                      : 'text-[#7A6A5C] hover:text-[#2A211A]'
                  }`}
                >
                  <span>🚚 Je suis Transporteur</span>
                </button>
              </div>
            </div>

            {/* Persona Showcase Content */}
            {activePersona === 'buyer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconSearch className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">1. Trouvez la perle rare</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Téléphones, mode, meubles, véhicules ou électroménager : explorez des milliers d'articles vérifiés à prix local.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconBike className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">2. Livraison express</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Un coursier récupère l'article chez le marchand et vous l'apporte directement à la maison ou au bureau.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">3. Inspectez puis payez</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Vous ne déboursez rien à l'avance. Payez par Wave, Orange Money ou espèces une fois satisfait du produit.
                  </p>
                </div>
              </div>
            )}

            {activePersona === 'seller' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-[#9B4A32]/15 text-[#9B4A32] flex items-center justify-center mb-4 shadow-2xs">
                    <IconSmartphone className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">1. Déposez en 30 secondes</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Prenez quelques photos, fixez votre prix et votre article est instantanément visible par des milliers d'acheteurs.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconTrendingUp className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">2. Vendez dans tout le pays</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Ne dépendez plus de votre seul quartier. Des clients de Dakar à Saint-Louis peuvent vous commander.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">3. Encaissement automatique</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Le livreur encaisse l'argent auprès de l'acheteur et vous le reverse sans délai sur votre compte Mobile Money.
                  </p>
                </div>
              </div>
            )}

            {activePersona === 'driver' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C3049]/15 text-[#1C3049] flex items-center justify-center mb-4 shadow-2xs">
                    <IconCar className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">1. Roulez avec votre véhicule</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Que vous ayez une moto, un taxi, un pick-up ou une camionnette, vos trajets deviennent une source de revenus.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconClock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">2. Horaires 100% libres</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Connectez-vous quand vous le souhaitez, acceptez les livraisons proches de vous et gardez le contrôle total.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-[#DDCDB6]/70 shadow-xs glass-card-hover">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mb-4 shadow-2xs">
                    <IconStar className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#2A211A] mb-2">3. Gains immédiats</h4>
                  <p className="text-xs text-[#7A6A5C] leading-relaxed">
                    Recevez vos commissions sans attente directement par Wave ou Orange Money à la fin de chaque course.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. VALEURS & RAISONS D'ENTRER (Pourquoi nous rejoindre ?)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133] bg-[#E8DBC8] px-4 py-1 rounded-full">
            ✦ Pourquoi NovaSen ?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-[#2A211A] mt-4 mb-4">
            Construit pour changer votre quotidien.
          </h2>
          <p className="text-base text-[#7A6A5C]">
            Trois piliers fondamentaux pour une expérience fluide, humaine et sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pilier 1 */}
          <div className="glass-nixtio rounded-[32px] p-8 border border-white glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7A5133] to-[#9B4A32] text-white flex items-center justify-center mb-6 shadow-md">
                <IconShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#2A211A] mb-3">
                Confiance & Sérénité
              </h3>
              <p className="text-sm text-[#7A6A5C] leading-relaxed mb-6">
                Toutes les identités et profils marchands sont vérifiés. Fini les mauvaises surprises ou les colis qui n'arrivent jamais.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DDCDB6]/40 text-xs font-bold text-[#7A5133] flex items-center gap-1">
              <span>Sécurité certifiée</span>
              <IconCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Pilier 2 */}
          <div className="glass-nixtio rounded-[32px] p-8 border border-white glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1C3049] to-[#385D8A] text-white flex items-center justify-center mb-6 shadow-md">
                <IconMapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#2A211A] mb-3">
                Proximité Nationale
              </h3>
              <p className="text-sm text-[#7A6A5C] leading-relaxed mb-6">
                Des grands marchés de Dakar (Sandaga, HLM, Petersen) jusqu'aux régions les plus éloignées, nous abolissons les distances.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DDCDB6]/40 text-xs font-bold text-[#1C3049] flex items-center gap-1">
              <span>Couverture 14 régions</span>
              <IconCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Pilier 3 */}
          <div className="glass-nixtio rounded-[32px] p-8 border border-white glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center mb-6 shadow-md">
                <IconSmartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-[#2A211A] mb-3">
                Simplicité Déconcertante
              </h3>
              <p className="text-sm text-[#7A6A5C] leading-relaxed mb-6">
                Pas besoin de mot de passe compliqué : connectez-vous directement avec votre numéro de téléphone et recevez votre code par SMS.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DDCDB6]/40 text-xs font-bold text-emerald-800 flex items-center gap-1">
              <span>Connexion OTP en 10 secondes</span>
              <IconCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. SIMULATEUR TRANSPARENT (Visualisation avant connexion)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="glass-nixtio rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 border border-white shadow-xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049] bg-[#DDE7F0] px-4 py-1 rounded-full">
            ✦ Aperçu Tarifaire
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2A211A] mt-4 mb-3">
            Combien coûte une livraison avec NovaSen ?
          </h2>
          <p className="text-sm text-[#7A6A5C] max-w-xl mx-auto mb-8">
            Testez notre estimateur transparent avant même de créer votre compte.
          </p>

          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 border border-[#DDCDB6] shadow-xs text-left mb-8">
            {/* Choix véhicule */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedVehicle('moto')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedVehicle === 'moto'
                    ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-sm scale-105'
                    : 'bg-[#F2E9DC]/40 text-[#7A6A5C] border-[#DDCDB6]'
                }`}
              >
                <IconBike className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">Moto</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVehicle('taxi')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedVehicle === 'taxi'
                    ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-sm scale-105'
                    : 'bg-[#F2E9DC]/40 text-[#7A6A5C] border-[#DDCDB6]'
                }`}
              >
                <IconCar className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">Taxi</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVehicle('camion')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedVehicle === 'camion'
                    ? 'bg-[#1C3049] text-white border-[#1C3049] shadow-sm scale-105'
                    : 'bg-[#F2E9DC]/40 text-[#7A6A5C] border-[#DDCDB6]'
                }`}
              >
                <IconTruck className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold block">Camion</span>
              </button>
            </div>

            {/* Curseur Distance */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-[#2A211A] mb-2">
                <span>Distance estimée :</span>
                <span className="text-[#1C3049] font-extrabold">{simKm} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                value={simKm}
                onChange={(e) => setSimKm(Number(e.target.value))}
                className="w-full accent-[#1C3049] cursor-pointer h-2 bg-[#E8DBC8] rounded-lg"
              />
            </div>

            {/* Résultat */}
            <div className="bg-[#F2E9DC] rounded-2xl p-4 text-center">
              <div className="text-[11px] font-bold text-[#7A6A5C] uppercase tracking-wider">Tarif Estimé</div>
              <div className="text-3xl font-bold font-heading text-[#1C3049] mt-1">
                {calculateEstimate()} FCFA
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold mt-1">Paiement uniquement à la livraison</div>
            </div>
          </div>

          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1C3049] text-white font-bold text-sm hover:bg-[#13223A] transition-all shadow-md"
          >
            <span>Se connecter pour réserver</span>
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. BANNIÈRE FINALE : PASSEZ À L'ACTION (Conversion)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-[40px] bg-gradient-to-tr from-[#573721] via-[#7A5133] to-[#1C3049] text-white p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
            ✦ L'accès est 100% gratuit
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading mb-6 max-w-3xl mx-auto leading-tight">
            Entrez dans le nouveau commerce sénégalais.
          </h2>

          <p className="text-base sm:text-lg text-[#E8DBC8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Rejoignez des milliers de marchands, acheteurs et transporteurs qui font grandir leurs projets grâce à NovaSen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/connexion"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-[#573721] font-bold text-base hover:bg-[#F2E9DC] hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Créer mon compte en 30s
            </Link>
            <Link
              href="/connexion"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/15 border border-white/30 text-white font-semibold text-base hover:bg-white/25 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
            >
              Se connecter avec mon numéro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
