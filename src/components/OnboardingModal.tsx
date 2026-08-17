'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { IconShieldCheck } from './ui/Icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AVATARS = [
  { id: 'av1', label: 'Teranga Pro', emoji: '💼', bg: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'av2', label: 'Commerçant', emoji: '🛍️', bg: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { id: 'av3', label: 'Chauffeur VIP', emoji: '🚗', bg: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'av4', label: 'Citoyen NovaSen', emoji: '✨', bg: 'bg-stone-100 border-stone-300 text-stone-800' },
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('av4');
  
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !goal) return;
    if (step === 2 && !region) return;
    if (step === 3 && !source) return;

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = async () => {
    setIsFinishing(true);
    setProgress(15);

    // Save preferences in Supabase profile or localStorage
    try {
      if (user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          preferences: {
            goal,
            region,
            discovery_source: source,
            avatar_id: selectedAvatar,
            onboarded_at: new Date().toISOString(),
          },
        });
        await refreshProfile();
      }
      localStorage.setItem('novasen_onboarding_done', 'true');
    } catch (e) {
      console.warn('Could not save onboarding preferences:', e);
      localStorage.setItem('novasen_onboarding_done', 'true');
    }

    // Animation de progression cinématique
    const timer1 = setTimeout(() => setProgress(45), 300);
    const timer2 = setTimeout(() => setProgress(80), 700);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onComplete();
        // Redirection vers le service choisi si pertinent
        if (goal.includes('transport')) {
          router.push('/transport');
        } else {
          router.push('/marche');
        }
      }, 500);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E7E2D6] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header & Progress */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7A5133] text-white flex items-center justify-center font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <span className="text-xs font-bold text-[#573721]">Bienvenue sur NovaSen</span>
              <p className="text-[10px] text-stone-500">Personnalisation de votre espace</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? 'bg-[#7A5133]' : 'bg-stone-200'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-[#7A5133] ml-2">
              {step}/4
            </span>
          </div>
        </div>

        {/* Corps du Formulaire */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isFinishing ? (
            /* ───────────────────────────────────────────────────────────── */
            /* ANIMATION D'OUVERTURE CINÉMATIQUE */
            /* ───────────────────────────────────────────────────────────── */
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full bg-[#7A5133]/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#573721] to-[#7A5133] text-white flex items-center justify-center text-4xl shadow-xl">
                  ✨
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#1C1917] font-heading">
                  Votre espace est prêt !
                </h3>
                <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
                  NovaSen personnalise les meilleures offres et trajets pour votre région.
                </p>
              </div>

              {/* Barre de chargement dorée */}
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#7A5133] to-amber-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2 font-medium">
                  <span>Configuration du profil</span>
                  <span className="font-bold text-[#7A5133]">{progress}%</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <IconShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Accès certifié & Sécurisé</span>
              </div>
            </div>
          ) : (
            <>
              {/* ───────────────────────────────────────────────────────────── */}
              {/* QUESTION 1 : OBJECTIF PRINCIPAL */}
              {/* ───────────────────────────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#7A5133] uppercase tracking-wider">Question 1 sur 3</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-heading mt-1">
                      Que recherchez-vous principalement sur NovaSen ?
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Cela nous permet d&apos;ajuster les recommandations dès votre entrée.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {[
                      { id: 'market_buy', icon: '🛍️', title: 'Acheter des articles & Trouver des boutiques', desc: 'Produits locaux, mode, électroménager, alimentation...' },
                      { id: 'market_sell', icon: '🏪', title: 'Vendre mes produits & Gérer mon commerce', desc: 'Publier des annonces, recevoir des paiements Wave/OM...' },
                      { id: 'transport_ride', icon: '🚗', title: 'Réserver un trajet ou un chauffeur', desc: 'Courses urbaines, trajets interurbains Dakar/Régions...' },
                      { id: 'all', icon: '⭐', title: 'Tout à la fois (Commerçant & Voyageur)', desc: 'Profiter de toutes les fonctionnalités NovaSen' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGoal(opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                          goal === opt.id
                            ? 'bg-[#FAF6F0] border-[#7A5133] ring-2 ring-[#7A5133]/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <div>
                          <div className="text-sm font-extrabold text-[#1C1917]">{opt.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* QUESTION 2 : RÉGION AU SÉNÉGAL */}
              {/* ───────────────────────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#7A5133] uppercase tracking-wider">Question 2 sur 3</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-heading mt-1">
                      Dans quelle région du Sénégal vous trouvez-vous ?
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Pour vous connecter aux vendeurs et chauffeurs les plus proches de chez vous.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      { id: 'dakar', label: 'Dakar & Banlieue', sub: 'Plateau, Almadies, Guédiawaye, Pikine, Rufisque' },
                      { id: 'thies', label: 'Thiès & Mbour', sub: 'Saly, Tivaouane, Petite-Côte' },
                      { id: 'centre', label: 'Touba & Diourbel', sub: 'Kaolack, Fatick, Kaffrine' },
                      { id: 'nord', label: 'Saint-Louis & Louga', sub: 'Matam, Podor, Vallée' },
                      { id: 'sud', label: 'Ziguinchor & Casamance', sub: 'Kolda, Sédhiou, Cap Skirring' },
                      { id: 'est', label: 'Tambacounda & Kédougou', sub: 'Sénégal oriental' },
                    ].map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setRegion(reg.id)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          region === reg.id
                            ? 'bg-[#FAF6F0] border-[#7A5133] ring-2 ring-[#7A5133]/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="text-sm font-extrabold text-[#1C1917]">📍 {reg.label}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{reg.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* QUESTION 3 : DÉCOUVERTE DU SITE */}
              {/* ───────────────────────────────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#7A5133] uppercase tracking-wider">Question 3 sur 3</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-heading mt-1">
                      Comment avez-vous découvert NovaSen ?
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Votre avis nous aide à grandir et à faire connaître la plateforme au Sénégal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {[
                      { id: 'social', icon: '📱', label: 'Réseaux sociaux (TikTok, Instagram, Facebook)' },
                      { id: 'friend', icon: '👥', label: 'Recommandation d’un ami ou proche' },
                      { id: 'whatsapp', icon: '💬', label: 'Groupe WhatsApp / Communauté locale' },
                      { id: 'search', icon: '🔍', label: 'Recherche Google / Internet' },
                    ].map((src) => (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => setSource(src.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-3.5 cursor-pointer ${
                          source === src.id
                            ? 'bg-[#FAF6F0] border-[#7A5133] ring-2 ring-[#7A5133]/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{src.icon}</span>
                        <span className="text-sm font-extrabold text-[#1C1917]">{src.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* ÉTAPE 4 : CHOIX D'AVATAR / PROFIL */}
              {/* ───────────────────────────────────────────────────────────── */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#7A5133] uppercase tracking-wider">Personnalisation</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-heading mt-1">
                      Choisissez votre badge de profil
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Ce badge apparaîtra sur vos annonces et lors de vos réservations.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                          selectedAvatar === av.id
                            ? 'bg-[#FAF6F0] border-[#7A5133] ring-2 ring-[#7A5133]/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${av.bg}`}>
                          {av.emoji}
                        </div>
                        <span className="text-xs font-extrabold text-[#1C1917]">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer avec Boutons d'Action */}
        {!isFinishing && (
          <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition cursor-pointer"
              >
                ← Précédent
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalize}
                className="px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                Passer pour le moment
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={(step === 1 && !goal) || (step === 2 && !region) || (step === 3 && !source)}
              className="px-6 py-3 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <span>{step === 4 ? 'Accéder à NovaSen ✨' : 'Continuer →'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
